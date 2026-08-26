import copyWebpackPlugin from "copy-webpack-plugin";
import eslintPlugin from "eslint-webpack-plugin";
import htmlWebpackPlugin from "html-webpack-plugin";
import miniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import type webpack from "webpack";
import type { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

export default (env: any): webpack.Configuration & { devServer?: WebpackDevServerConfiguration } => ({
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "/docs"),
        filename: "[name].bundle.js",
        clean: true,
        // "auto" lets webpack resolve async chunk URLs against the actual script
        // src (the location where main.bundle.js was loaded from), instead of
        // against the current page URL. This makes chunk loading work correctly
        // even when the page is at a subpath like /HuTao or /model-viewer/HuTao.
        publicPath: "auto"
    },
    optimization: {
        minimize: env.production,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                glslShaders: {
                    test: (module: webpack.Module): boolean => {
                        if ((module as webpack.NormalModule).resource === undefined) {
                            return false;
                        }
                        const resource = (module as webpack.NormalModule).resource.replace(/\\/g, "/");
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
                    test: (module: webpack.Module): boolean => {
                        if ((module as webpack.NormalModule).resource === undefined) {
                            return false;
                        }
                        const resource = (module as webpack.NormalModule).resource.replace(/\\/g, "/");
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
            },
            {
                test: /\.css$/,
                use: [
                    miniCssExtractPlugin.loader,
                    "css-loader",
                    "postcss-loader"
                ]
            }
        ]
    },
    resolve: {
        alias: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "@": path.resolve(__dirname, "src"),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "react": "preact/compat",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "react-dom": "preact/compat"
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
        new miniCssExtractPlugin({
            filename: "[name].css"
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
        port: 20310,
        allowedHosts: "all",
        client: {
            logging: "none"
        },
        hot: true,
        watchFiles: ["src/**/*"],
        historyApiFallback: {
            index: "/index.html",
        },
        server: "https"
        // NOTE: The original config set Cross-Origin-Opener-Policy: same-origin and
        // Cross-Origin-Embedder-Policy: require-corp, which are needed for
        // SharedArrayBuffer. Under COEP, ALL cross-origin subresources (including
        // <img>) must send a Cross-Origin-Resource-Policy header. The local file
        // server on 127.0.0.1:8080 does not, so character portraits get blocked
        // with ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep.
        //
        // Since the app uses MmdWasmInstanceTypeSPR (single-threaded — no
        // SharedArrayBuffer required), we can safely drop these headers to unblock
        // cross-origin image loads. If MultiPhysicsRelease is enabled later, add
        // them back and either:
        //   (a) configure the portrait server to send `Cross-Origin-Resource-Policy: cross-origin`, or
        //   (b) proxy /gi, /hsr, /zzz, /ww, /hna, /nte through this dev-server.
    },
    ignoreWarnings: [
        (warning): boolean => warning.message.includes("Circular dependency between chunks with runtime")
    ],
    mode: env.production ? "production" : "development"
});