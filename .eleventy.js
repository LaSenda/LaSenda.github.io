// .eleventy.js
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const pluginTOC = require('eleventy-plugin-toc');

module.exports = async function(eleventyConfig) {
  // ————— Helper para cargar plugins (soporta ESM dynamic import o require)
  async function loadModule(name) {
    try {
      const mod = await import(name);
      return mod.default ?? mod;
    } catch (e) {
      try {
        return require(name);
      } catch (e2) {
        console.warn(`No se pudo cargar ${name}:`, e2.message);
        return null;
      }
    }
  }

  // Configurar Markdown con anclajes para TOC
  eleventyConfig.setLibrary(
    'md',
    markdownIt({ html: true }).use(markdownItAnchor)
  );
  
  // Plugin TOC
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'nav',
    wrapperClass: 'toc'
  });

  // ————— Helper para cargar plugins (soporta ESM dynamic import o require)
  async function loadModule(name) {
    try {
      const mod = await import(name);
      return mod.default ?? mod;
    } catch (e) {
      try {
        return require(name);
      } catch (e2) {
        console.warn(`No se pudo cargar ${name}:`, e2.message);
        return null;
      }
    }
  }




  

  // Plugin RSS
  eleventyConfig.addPlugin(rssPlugin);

  // --- Bundle, Image y Sitemap ---
  const bundlePlugin = await loadModule("@11ty/eleventy-plugin-bundle");
  if (bundlePlugin && typeof bundlePlugin === "function") {
    eleventyConfig.addPlugin(bundlePlugin);
  } else if (bundlePlugin) {
    eleventyConfig.addPlugin(bundlePlugin);
  }

  const eleventyImgMod = await loadModule("@11ty/eleventy-img");
  const imagePlugin =
    eleventyImgMod?.eleventyImageTransformPlugin ??
    eleventyImgMod?.eleventyImageShortcode ??
    eleventyImgMod?.default ??
    eleventyImgMod;
  if (imagePlugin && typeof imagePlugin === "function") {
    try {
      eleventyConfig.addPlugin(imagePlugin);
    } catch (e) {
      console.warn("No se pudo registrar el plugin de imagen:", e.message);
    }
  }

  const sitemapPlugin = await loadModule("@quasibit/eleventy-plugin-sitemap");
  if (sitemapPlugin) {
    const sitemapOptions = {
      sitemap: {
        hostname: "https://lasenda.github.io/"
      }
    };
    try {
      eleventyConfig.addPlugin(sitemapPlugin, sitemapOptions);
    } catch (e) {
      console.warn("No se pudo registrar sitemap plugin:", e.message);
      try { eleventyConfig.addPlugin(sitemapPlugin); } catch (_) {}
    }
  }
const { eleventyImageTransformPlugin } = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  

  
  // 2. PLUGIN DE OPTIMIZACIÓN con rutas corregidas
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    extensions: "html",
    formats: ["avif", "webp", "jpeg"],
    widths: ["auto"],
    
    // Las imágenes optimizadas se guardan aquí
    outputDir: "./_site/Assets/img/",
    
    // Esta es la URL donde estarán disponibles en el navegador
    urlPath: "/Assets/img/",
    
    htmlOptions: {
      imgAttributes: {
        loading: "lazy",
        decoding: "async"
      }
    },
    
    svgShortCircuit: true,
    failOnError: false
  });

  // 3. Configuración del directorio
  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
};



  

  // ————— Copiar Assets —————
  eleventyConfig.addPassthroughCopy({ "src/Assets": "Assets" });

  // ————— Colecciones —————
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articulos/**/*.{md,html}")
      .filter(post => post.data && post.data.title)
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("categories", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("src/articulos/**/*.{md,html}")
      .filter(post => post.data && post.data.title);

    const map = {};
    posts.forEach(post => {
      const cats = post.data.categories || [];
      cats.forEach(cat => {
        if (!map[cat]) map[cat] = [];
        map[cat].push(post);
      });
    });

    return map;
  });

  // ————— Filtros —————
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // Filtro JSON para escapar correctamente en JSON
  eleventyConfig.addFilter("jsonify", (value) => {
    return JSON.stringify(value);
  });

  // ————— Configuración de permalinks —————
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const input = data.page.inputPath;

      // Para feeds XML, no tocar
      if (input.endsWith(".xml.njk") || input.endsWith(".atom.njk")) {
        return;
      }

      // Para archivos JSON, devolver su permalink del frontmatter
      if (input.endsWith(".json.njk")) {
        return data.permalink;
      }

      // No tocar Assets
      if (input.includes("Assets")) {
        return false;
      }

      // Para el resto → forzar .html
      return `${data.page.filePathStem}.html`;
    }
  });

  // ————— Configuración de directorios —————
  return {
    dir: {
      input: "src",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};