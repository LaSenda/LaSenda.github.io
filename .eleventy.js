const rssPlugin = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Si quieres usar el plugin RSS más adelante
  eleventyConfig.addPlugin(rssPlugin);

  // Copiar Assets enteros sin procesar
  eleventyConfig.addPassthroughCopy({ "src/Assets": "Assets" });

  // Colección de posts (si la usas)
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

  // Permalink global (⚠️ ahora ignora Assets y feeds)
  eleventyConfig.addGlobalData("permalink", () => (data) => {
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

    // Para el resto (md, njk, html) → forzar .html
    return `${data.page.filePathStem}.html`;
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    templateFormats: ["md", "njk", "html", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: ""
  };
};
