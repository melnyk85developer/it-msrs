import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';


export function buildWebServer(options: BuildOptions): DevServerConfiguration {
    return {
        port: options.port ?? 3000,
        open: true,
        //Эта опция работает только для devServer, если раздавать статику через nginx, то там нужно так же проксировать все запросы в index.html
        historyApiFallback: true,
        hot: true
    }
}