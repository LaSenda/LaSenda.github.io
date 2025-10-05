// .eleventy.js (reemplaza tu archivo actual con esto)
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");

module.exports = async function(eleventyConfig) {
  // ————— Helper para cargar plugins (soporta ESM dynamic import o require)
  async function loadModule(name) {
    try {
      // try dynamic import (works for ESM)
      const mod = await import(name);
      return mod.default ?? mod;
    } catch (e) {
      try {
        // fallback a require (CommonJS)
        return require(name);
      } catch (e2) {
        console.warn(`No se pudo cargar ${name}:`, e2.message);
        return null;
      }
    }
  }

  // Plugin RSS (que ya tenías)
  eleventyConfig.addPlugin(rssPlugin);

  // --- NEW: Bundle, Image y Sitemap (cargados de forma segura) ---
  // Bundle plugin (oficial @11ty)
  const bundlePlugin = await loadModule("@11ty/eleventy-plugin-bundle");
  if (bundlePlugin && typeof bundlePlugin === "function") {
    eleventyConfig.addPlugin(bundlePlugin);
  } else if (bundlePlugin) {
    // si exporta objeto plugin válido
    eleventyConfig.addPlugin(bundlePlugin);
  }

  // Eleventy Image: la librería es principalmente una utilidad; hay un transform plugin exportado en algunas versiones
  const eleventyImgMod = await loadModule("@11ty/eleventy-img");
  // buscar un plugin transform conocido (nombre oficial en docs: eleventyImageTransformPlugin)
  const imagePlugin =
    eleventyImgMod?.eleventyImageTransformPlugin ??
    eleventyImgMod?.eleventyImageShortcode ??
    eleventyImgMod?.default ??
    eleventyImgMod;
  if (imagePlugin && typeof imagePlugin === "function") {
    try {
      eleventyConfig.addPlugin(imagePlugin);
    } catch (e) {
      console.warn("No se pudo registrar el plugin de imagen como plugin (se puede usar la API directamente):", e.message);
    }
  } else {
    // no hay plugin registrable: dejamos la utilidad disponible para importarla en shortcodes si quieres
    // (no hacemos nada para no romper tu config)
  }

  // Sitemap plugin (comunidad @quasibit)
  const sitemapPlugin = await loadModule("@quasibit/eleventy-plugin-sitemap");
  if (sitemapPlugin) {
    // Opciones mínimas — **cambia hostname por tu dominio real**
    const sitemapOptions = {
      sitemap: {
        hostname: "https://example.com" // <- CAMBIA ESTO por tu dominio real
      }
    };
    try {
      eleventyConfig.addPlugin(sitemapPlugin, sitemapOptions);
    } catch (e) {
      console.warn("No se pudo registrar sitemap plugin con opciones; intentando registrar sin opciones:", e.message);
      try { eleventyConfig.addPlugin(sitemapPlugin); } catch (_) {}
    }
  }

  // ————— Resto de tu configuración sin cambios significativos —————
  // Copiar Assets enteros sin procesar
  eleventyConfig.addPassthroughCopy({ "src/Assets": "Assets" });

  // Colección de posts
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articulos/**/*.{md,html}")
      .filter(post => post.data && post.data.title)
      .sort((a, b) => b.date - a.date);
  });

  // Filtro de fecha
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // CORREGIDO: Configuración de permalinks mejorada
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const input = data.page.inputPath;

      // No tocar feeds
      if (
        input.endsWith(".xml.njk") ||
        input.endsWith(".atom.njk") ||
        input.endsWith(".json.njk")
      ) {
        return false;
      }

      // No tocar nada dentro de Assets
      if (input.includes("Assets")) {
        return false;
      }

      // Para el resto → forzar .html
      return `${data.page.filePathStem}.html`;
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    // CORREGIDO: Quitar "xml" de templateFormats
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
