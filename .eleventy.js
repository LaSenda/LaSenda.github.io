module.exports = function(eleventyConfig) {
  // Le decimos a Eleventy que copie las carpetas de assets desde DENTRO de "src"
  eleventyConfig.addPassthroughCopy("src/Assets/CSS");
  eleventyConfig.addPassthroughCopy("src/Assets/img");
  eleventyConfig.addPassthroughCopy("src/Assets/js");

  // Definimos la nueva estructura del proyecto
  return {
    dir: {
      input: "src",      // La carpeta donde está todo tu código
      output: "_site"    // La carpeta donde Eleventy genera la web
    }
  };
};
