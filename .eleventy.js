const rssPlugin = require("@11ty/eleventy-plugin-rss");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Plugin RSS: añade filtros RSS y date para Nunjucks
  eleventyConfig.addPlugin(rssPlugin);

  // Copiar solo assets (CSS, imágenes, JS)
  eleventyConfig.addPassthroughCopy("src/Assets/css");
  eleventyConfig.addPassthroughCopy("src/Assets/img");
  eleventyConfig.addPassthroughCopy("src/Assets/js");

  // Colección "posts"
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articulos/**/*.{md,html}")
      .filter(post => post.data && post.data.title)
      .sort((a, b) => b.date - a.date);
  });

  // Filtro "date"
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // Permalink global SOLO para páginas HTML/Markdown
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    // Si es XML (feed), no tocar (usa frontmatter)
    if (data.page.inputPath && data.page.inputPath.endsWith(".xml.njk")) {
      return data.page.filePathStem + data.page.outputFileExtension;
    }
    // Para MD, NJK o HTML, forzar .html
    return `${data.page.filePathStem}.html`;
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    // Incluir XML para procesar feed.xml.njk
    templateFormats: ["md", "njk", "html", "xml"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: ""
  };
};
