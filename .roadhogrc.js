const pxtorem = require('postcss-pxtorem');
const pxtorem2 = _interopRequireDefault(pxtorem).default;
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const path = require('path');
const svgSpriteDirs = [
  require.resolve('antd-mobile').replace(/warn\.js$/, ''), // antd-mobile 内置svg
  path.resolve(__dirname, 'src/svg'),  // 业务代码本地私有 svg 存放目录
];
export default {
  entry: "src/index.js",
  svgSpriteLoaderDirs: svgSpriteDirs,
  "env": {
    "development": {
      "extraBabelPlugins": [
        "dva-hmr",
        "transform-runtime",
        ["import", { "style": "css", "libraryName": "antd" ,"libraryDirectory": "lib"}]
      ]
    },
    "production": {
      "extraBabelPlugins": [
        "transform-runtime",
        ["import", { "style": "css", "libraryName": "antd" ,"libraryDirectory": "lib"}]
      ]
    }
  }
}
