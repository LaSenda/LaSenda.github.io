module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("CSS");
  eleventyConfig.addPassthroughCopy("JS");
  eleventyConfig.addPassthroughCopy("assets");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
