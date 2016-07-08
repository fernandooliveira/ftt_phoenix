const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');

const development = require('./dev.config.js');
const production = require('./prod.config.js');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const path = require('path');

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

var devUrl;

// location dist for dev and prod
if (process.env.NODE_ENV === 'development') {
  devUrl = 'http://localhost:3000/dist/';
}

if (process.env.NODE_ENV === 'production') {
  devUrl = '/dist/';
}

const common = {
  output: {
    path: __dirname + '/../dist/',
    publicPath: devUrl,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },

  resolve: {
    extensions: ['', '.jsx', '.js', '.json', '.scss'],
    modulesDirectories: ['node_modules', 'dhtmlx'],
    // alias for beautiful import
    alias: {
      components: path.join(__dirname, '../app/components/'),
      'redux/modules': path.join(__dirname, '../app/redux/modules/'),
      constants: path.join(__dirname, '../app/constants/'),
      decorators: path.join(__dirname, '../app/decorators/'),
      utils: path.join(__dirname, '../app/utils/'),
      test: path.join(__dirname, '../app/test/'),
    },
  },

  module: {
    loaders: [{
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff',
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-woff2',
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/octet-stream',
    }, {
      test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=application/font-otf',
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'file',
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?limit=10000&mimetype=image/svg+xml',
    }, {
      test: /\.js$/,
      exclude: /node_modules|dhtmlx/,
      loader: 'babel-loader',
    }, {
      test: /\.png$/,
      loader: 'file?name=assets/[hash].[name].[ext]',
    }, {
      test: /\.jpg$/,
      loader: 'file?name=assets/[hash].[name].[ext]',
    }, {
      test: /\.gif$/,
      loader: 'file?name=assets/[hash].[name].[ext]',
    }, {
      test: /packery/,
      loader: 'imports?define=>false&this=>window',
    }],
  },

  externals: {
    "dhtmlx": "dhtmlx",
    "scheduler": "scheduler"
  },

  plugins: [
    // generate bundle.css for server-side-rendering
    new ExtractTextPlugin('bundle.css'),

    // define global constants
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: process.env.NODE_ENV === 'development' ? '"development"' : '"production"',
      },
      __DEVELOPMENT__: process.env.NODE_ENV === 'development',
      __PRODUCTION__: process.env.NODE_ENV === 'production',
      __DEVTOOLS__: process.env.NODE_ENV === 'development'
    }),

    // chunks for generate vendor bundle
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: (module) => {
        return module.resource &&
          module.resource.indexOf('node_modules') !== -1 &&
          module.resource.indexOf('dhtmlx') !== -1 &&
          module.resource.indexOf('.css') === -1;
      },
    })
  ],
  postcss: (wp) => {
    return [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ];
  },
};


common.plugins.splice(0,0, new CleanWebpackPlugin(['dist'], { root: process.cwd() }));
if (process.env.NODE_ENV === 'development') {
  module.exports = merge(development, common);
};

if (process.env.NODE_ENV === 'production') {
  module.exports = merge(production, common);
};
