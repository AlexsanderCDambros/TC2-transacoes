const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");
const webpack = require("webpack");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "tc2",
    projectName: "transacoes",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  const isProduction = argv.mode === "production" || webpackConfigEnv.NODE_ENV === "production";
  
  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
          new webpack.DefinePlugin({
            "process.env.API_BASE_URL": JSON.stringify(
              isProduction 
                ? "https://tc2-copia-api-production.up.railway.app" 
                : "http://localhost:3000"
            ),
          }),
        ],
  });
};
