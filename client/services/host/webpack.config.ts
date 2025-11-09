import webpack from 'webpack';
import path from 'path';
import {BuildMode, BuildPaths, BuildPlatform, BuildOptions, buildWebpack} from '@packages/build-config'
import packageJson from './package.json'

interface EnvVariables {
    mode?: BuildMode;
    analyzer?: boolean;
    port?: number;
    platform?: BuildPlatform;
    SHOP_REMOTE_URL?: string;
    SHOPS_REMOTE_URL?: string;
    ADMIN_REMOTE_URL?: string;
    MY_PROFILE_REMOTE_URL?: string;
    SETTINGS_MY_PROFILE_REMOTE_URL?: string;
    USER_PROFILE_REMOTE_URL?: string;
    USERS_REMOTE_URL?: string;
    MUSIC_REMOTE_URL?: string;
    AUTH_REMOTE_URL?: string;
    USERS_MESSAGES_REMOTE_URL?: string;
}

export default (env: EnvVariables) => {
    const paths: BuildPaths = {
        output: path.resolve(__dirname, 'build'),
        entry: path.resolve(__dirname, 'src', 'index.tsx'),
        html: path.resolve(__dirname, 'public', 'index.html'),
        public: path.resolve(__dirname, 'public'),
        src: path.resolve(__dirname, 'src'),
    }

    const config: webpack.Configuration = buildWebpack({
        port: env.port ?? 3000,
        mode: env.mode ?? 'development',
        paths,
        analyzer: env.analyzer,
        platform: env.platform ?? 'desktop'
    })
    const ADMIN_REMOTE_URL = env.ADMIN_REMOTE_URL ?? 'http://localhost:3001'
    const MY_PROFILE_REMOTE_URL = env.MY_PROFILE_REMOTE_URL ?? 'http://localhost:3002'
    const SHOP_REMOTE_URL = env.SHOP_REMOTE_URL ?? 'http://localhost:3003'
    const AUTH_REMOTE_URL = env.AUTH_REMOTE_URL ?? 'http://localhost:3004'
    const USERS_REMOTE_URL = env.USERS_REMOTE_URL ?? 'http://localhost:3005'
    const USER_PROFILE_REMOTE_URL = env.USER_PROFILE_REMOTE_URL ?? 'http://localhost:3006'
    const SHOPS_REMOTE_URL = env.SHOPS_REMOTE_URL ?? 'http://localhost:3007'
    const MUSIC_REMOTE_URL = env.MUSIC_REMOTE_URL ?? 'http://localhost:3008'
    const SETTINGS_MY_PROFILE_REMOTE_URL = env.SETTINGS_MY_PROFILE_REMOTE_URL ?? 'http://localhost:3009'
    const USERS_MESSAGES_REMOTE_URL = env.USERS_MESSAGES_REMOTE_URL ?? 'http://localhost:3010'


    config.plugins.push(new webpack.container.ModuleFederationPlugin({
        name: 'host',
        filename: 'remoteEntry.js',
        remotes: {
            admin: `admin@${ADMIN_REMOTE_URL}/remoteEntry.js`,
            myprofile: `myprofile@${MY_PROFILE_REMOTE_URL}/remoteEntry.js`,
            settingsprofile: `settingsprofile@${SETTINGS_MY_PROFILE_REMOTE_URL}/remoteEntry.js`,
            messages: `messages@${USERS_MESSAGES_REMOTE_URL}/remoteEntry.js`,
            userprofile: `userprofile@${USER_PROFILE_REMOTE_URL}/remoteEntry.js`,
            shop: `shop@${SHOP_REMOTE_URL}/remoteEntry.js`,
            shops: `shops@${SHOPS_REMOTE_URL}/remoteEntry.js`,
            auth: `auth@${AUTH_REMOTE_URL}/remoteEntry.js`,
            users: `users@${USERS_REMOTE_URL}/remoteEntry.js`,
            music: `music@${MUSIC_REMOTE_URL}/remoteEntry.js`,
        },
        shared: {
            ...packageJson.dependencies,
            react: {
                eager: true,
                requiredVersion: packageJson.dependencies['react'],
            },
            'react-router-dom': {
                eager: true,
                requiredVersion: packageJson.dependencies['react-router-dom'],
            },
            'react-dom': {
                eager: true,
                requiredVersion: packageJson.dependencies['react-dom'],
            },
        }
    }))

    return config
} 