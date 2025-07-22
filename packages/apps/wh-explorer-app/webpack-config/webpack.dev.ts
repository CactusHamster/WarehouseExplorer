import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

import { BASE_CONFIG, __dirname } from "./webpack.base.js";

import "webpack-dev-server";
import { merge } from "webpack-merge";
import type { Configuration } from "webpack";

const DEV_CONFIG: Configuration = {
    mode: "development",
    devtool: "inline-source-map", // good for dev debugging
    output: {
        // override output filename for dev if you want (optional)
        filename: "bundle.js",
    },
    devServer: {
        static: {
            directory: resolve(__dirname, "dist"),
        },
        hot: true,
        port: 3000,
        open: false,
    },
};

export default merge(BASE_CONFIG, DEV_CONFIG);
