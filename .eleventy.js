const rssPlugin = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Plugin RSS (si lo usas)
  eleventyConfig.addPlugin(rssPlugin);

  // CAMBIO #1: La ruta correcta para tus assets
  // Como tu carpeta "Assets" está en la raíz, esta es la forma correcta.
  eleventyConfig.addPassthroughCopy("Assets");

  // Tu colección de posts está bien, solo ajustamos el glob para la raíz.
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("./articulos/**/*.{md,html}")
      .filter(post => post.data && post.data.title)
      .sort((a, b) => b.date - a.date);
  });

  // Tus filtros y permalinks no necesitan cambios.
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });
  
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    const input = data.page.inputPath;
    if (input.endsWith(".xml.njk") || input.endsWith(".atom.njk") || input.endsWith(".json.njk")) {
      return false;
    }
    if (input.includes("Assets")) {
      return false;
    }
    return `${data.page.filePathStem}.html`;
  });

  return {
    // CAMBIO #2 Y EL MÁS IMPORTANTE:
    // Le decimos a Eleventy que tu contenido está en el directorio raíz ("."), no en "src".
    dir: {
      input: ".",
      output: "_site"
    },
    
    templateFormats: ["md", "njk", "html", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
