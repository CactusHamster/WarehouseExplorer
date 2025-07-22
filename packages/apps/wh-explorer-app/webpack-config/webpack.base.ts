import { dirname, resolve, join } from "path";
import { fileURLToPath } from "url";

import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import type { Configuration } from "webpack";

const __dirname = resolve(dirname(fileURLToPath(new URL(import.meta.url))), "../");

console.log(__dirname)

const BASE_CONFIG: Configuration = {
    entry: join(__dirname, "./src/index.tsx"),
    output: {
        path: join(__dirname, "dist"),
        filename: "bundle.js",
        assetModuleFilename: "assets/[hash][ext][query]",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    module: {
        rules: [
            // TypeScript
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            // CSS
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            // SASS / SCSS
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            // Images
            {
                test: /\.(png|jpe?g|gif|svg|webp)$/i,
                type: "asset/resource",
            },
            // Fonts
            {
                test: /\.(woff(2)?|eot|ttf|otf)$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        // This plugin isn't necessary in Webpack 5+... but I like redundancy.
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: join(__dirname, "public/index.html"),
            filename: join(__dirname, "dist/index.html")
        }),
    ],
};

export {
    BASE_CONFIG,
    __dirname
};
