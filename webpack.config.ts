import copyWebpackPlugin from "copy-webpack-plugin";
import eslintPlugin from "eslint-webpack-plugin";
import htmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import type webpack from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

export default (env: any): webpack.Configuration & { devServer?: WebpackDevServerConfiguration } => ({
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/docs"),
        filename: "[name].bundle.js",
        clean: true,
        publicPath: ""
    },
    optimization: {
        minimize: env.production,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                glslShaders: {
                    test: (module: { type: string; resource: string | undefined }): boolean => {
                        if (module.resource === undefined) {
                            return false;
                        }
                        const resource = module.resource.replace(/\\/g, "/");
                        if (resource.includes("Shaders/")) {
                            return true;
                        }
                        return false;
                    },
                    name: "glslShaders",
                    chunks: "async",
                    enforce: true
                },
                wgslShaders: {
                    test: (module: { type: string; resource: string | undefined }): boolean => {
                        if (module.resource === undefined) {
                            return false;
                        }
                        const resource = module.resource.replace(/\\/g, "/");
                        if (resource.includes("ShadersWGSL/")) {
                            return true;
                        }
                        return false;
                    },
                    name: "wgslShaders",
                    chunks: "async",
                    enforce: true
                }
            }
        }
    },
    cache: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.m?js$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.html$/,
                loader: "html-loader"
            }
        ]
    },
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@": path.resolve(__dirname, "src")
        },
        modules: ["src", "node_modules"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        fallback: {
            "url": require.resolve("url/")
        }
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/index.html",
            filename: "index.html"
        }),
        new htmlWebpackPlugin({
            template: "./src/404.html",
            filename: "404.html"
        }),
        new eslintPlugin({
            extensions: ["ts", "tsx"],
            fix: true,
            cache: true,
            configType: "flat"
        }),
        new copyWebpackPlugin({
            patterns: [
                { from: "res", to: "res" }
            ]
        })
    ],
    devServer: {
        host: "0.0.0.0",
        port: 20315,
        allowedHosts: "all",
        client: {
            logging: "none"
        },
        hot: true,
        watchFiles: ["src/**/*"],
        historyApiFallback: {
            index: "/index.html",
        },
        server: "https",
        headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Cross-Origin-Opener-Policy": "same-origin",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "Cross-Origin-Embedder-Policy": "require-corp"
        }
    },
    ignoreWarnings: [
        (warning): boolean => warning.message.includes("Circular dependency between chunks with runtime")
    ],
    mode: env.production ? "production" : "development"
});
