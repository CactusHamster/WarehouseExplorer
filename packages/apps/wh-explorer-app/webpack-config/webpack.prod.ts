import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { BASE_CONFIG, __dirname } from "./webpack.base.js";

import { merge } from "webpack-merge";
import type { Configuration } from "webpack";

const PROD_CONFIG: Configuration = {
    mode: "production",
    output: {
        // Cache-busting
        filename: "bundle.[contenthash].js",
        path: resolve(__dirname, "dist"),
        clean: true,
    },
    devtool: "source-map",
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
};

export default merge(BASE_CONFIG, PROD_CONFIG);
