const path = require('path')
const webpack = require('webpack')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
module.exports = {
  /*
    Vue-cli3:
    Crashed when using Webpack `import()` #2463
    https://github.com/vuejs/vue-cli/issues/2463

   */
  /*
  pages: {
    index: {
      entry: 'src/main.js',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
  },
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },

  chainWebpack: (config) => {
    config.resolve.alias
      .set('@$', resolve('src'))
      .set('@api', resolve('src/api'))
      .set('@assets', resolve('src/assets'))
      .set('@comp', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@layout', resolve('src/layout'))
      .set('@static', resolve('src/static'))
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */

          /*
          'primary-color': '#F5222D',
          'link-color': '#F5222D',
          'border-radius-base': '4px',
          */
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    proxy: {
      '/pdd':{
        target:'http://wechat.morejoying.com/pdd',
        pathRewrite:{'^/pdd':''},
        changeOrigin:true,
        // secure:false,
      },
      // '/api':{
      //   target:'http://wechat.morejoying.com/api',
      //   pathRewrite:{'^/api':''},
      //   changeOrigin:true,
      // },
      // '/api':{
      //   target:'http://192.168.8.78:5000/api',
      //   pathRewrite:{'^/api':''},
      //   changeOrigin:true,
      // }
      '/api':{
        target:'http://192.168.48.104:5000/api',
        pathRewrite:{'^/api':''},
        changeOrigin:true,
      }
    },
    disableHostCheck: true
  },

  lintOnSave: undefined
}
