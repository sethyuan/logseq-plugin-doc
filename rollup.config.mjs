import html from "@rollup/plugin-html"
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { defineRollupSwcOption, swc } from "rollup-plugin-swc3"

export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    entryFileNames: "[name].[hash].js",
  },
  plugins: [
    html({
      template({ files }) {
        const index = files.js.find(({ name }) => name === "index")
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>logseq plugin</title>
    <link rel="icon" href="data:" />
    <link rel="modulepreload" as="script" href="${index.fileName}" />
  </head>
  <body>
    <script type="module" src="${index.fileName}"></script>
  </body>
</html>
`
      },
    }),
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
