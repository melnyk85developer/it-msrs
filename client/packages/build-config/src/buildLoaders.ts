import { ModuleOptions } from "webpack";
import { BuildOptions } from "./types/types";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from 'react-refresh-typescript'
import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders(options: BuildOptions): ModuleOptions['rules'] {

    const isDev = options.mode === 'development';

    const assetLoader = {
      test: /\.(png|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    }

    const svgrLoader = {
      test: /\.svg$/i,
      use: [
        { 
          loader: '@svgr/webpack', 
          options: {
            icon: true,
            svgrConfig: {
              plugins: [
                {
                  name: 'convertColors',
                  params: {
                    currentColor: true,
                  }
                }
              ]
            }
          } 
        }
      ],
    }

    const cssLoaderWidthModules = {
      loader: "css-loader",
      options: {
        modules: {
          localIdentName: isDev ? '[path][name]__[local]' : '[hash:base64:8]'
        }
      },
    }

    const scssLoader = {
      //Порядок имеет значение
      test: /\.s[ac]ss$/i,
      use: [
        // Creates `style` nodes from JS strings
        isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
        // Translates CSS into CommonJS
        cssLoaderWidthModules,
        // Compiles Sass to CSS
        "sass-loader",
      ],
    }

    const tsLoader = {
      exclude: /node_modules/,
      test: /\.tsx?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
            })
          }
        }
      ]
    }

    // const babelLoader = buildBabelLoader(options);

    const cssLoader = {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }

    return [
        assetLoader,
        cssLoader,
        scssLoader,
        tsLoader,
        // babelLoader,
        svgrLoader,
    ]
}