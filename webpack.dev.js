const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devServer: {
		contentBase: './dist',
		hot: false,
		inline: false,
		host: "localhost"
  },
});
