module.exports = function(eleventyConfig) {
  // Copiar Assets tal cual
  eleventyConfig.addPassthroughCopy("src/Assets");

  // Copiar todos los .html de src directamente (sin que 11ty los procese)
  eleventyConfig.addPassthroughCopy("src/**/*.html");

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    templateFormats: ["md"], // solo procesar Markdown
    htmlTemplateEngine: false // no tocar los HTML
  };
};
