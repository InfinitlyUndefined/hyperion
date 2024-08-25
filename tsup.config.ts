import {defineConfig} from "tsup";

export default defineConfig({
    clean: true,
    entry: ["./src/**/*.ts"],
    format: "esm",
    minify: true,
    outDir: "./dist",
    platform: "node",
    removeNodeProtocol: false,
    skipNodeModulesBundle: true,
    sourcemap: true,
    splitting: true,
    target: "esnext"
})