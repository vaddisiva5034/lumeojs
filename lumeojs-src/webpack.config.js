const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./lumeo", // Adjust path accordingly
  output: {
    filename: "lumeo.bundle.js",
    path: path.resolve(__dirname, "../lumeojs/dist"),
    library: "Lumeo", // This makes it available as a global variable
    libraryTarget: "umd",
  },
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  optimization: {
    minimize: true, // Enable minimization
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // Remove console logs in production
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all", // This enables code splitting
    },
  },
};
