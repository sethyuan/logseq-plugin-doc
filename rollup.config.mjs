import { nodeResolve } from "@rollup/plugin-node-resolve"
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3"

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
  },
  plugins: [
    nodeResolve(),
    swc(
      defineRollupSwcOption({
        jsc: {
          target: "es2021",
        },
      }),
    ),
  ],
}
