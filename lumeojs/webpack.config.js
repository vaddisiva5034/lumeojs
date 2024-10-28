const path = require("path");
module.exports = {
  entry: "../lumojs-src/lumeo", // Adjust path accordingly
  output: {
    filename: "lumeo.bundle.js",
    path: path.resolve(__dirname, "dist"),
    library: "Lumeo", // This makes it available as a global variable
    libraryTarget: "umd",
  },
  mode: "production", // Use 'development' for debugging
};
