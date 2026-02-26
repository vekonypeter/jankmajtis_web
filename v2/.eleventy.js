module.exports = function(eleventyConfig) {
  // Root-level assets shared with legacy PHP site
  eleventyConfig.addPassthroughCopy({
    "../images_gif": "images_gif",
    "../images_jpg": "images_jpg",
    "../images_png": "images_png",
    "../docs": "docs",
    "../news": "news",
    "../ASP.html": "ASP.html",
    "../favicon.ico": "favicon.ico"
  });

  // V2-only CSS and JS
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  // Date formatting filter (Hungarian format)
  eleventyConfig.addFilter("dateFormat", function(dateStr) {
    if (!dateStr) return "";
    var d = new Date(dateStr);
    return d.getFullYear() + "." +
      String(d.getMonth() + 1).padStart(2, "0") + "." +
      String(d.getDate()).padStart(2, "0") + ".";
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    }
  };
}
