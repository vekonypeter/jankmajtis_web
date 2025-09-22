module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    "../css": "css",
    "../js": "js",
    "../images_gif": "images_gif",
    "../images_jpg": "images_jpg",
    "../images_png": "images_png",
    "../docs": "docs",
    "../fancybox": "fancybox",
    "../news": "news",
    "../ASP.html": "ASP.html",
    "../favicon.ico": "favicon.ico"
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


