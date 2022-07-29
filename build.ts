import esbuild from "esbuild"
import fg from "fast-glob"
import path from "path"

const entryFiles = fg.sync(path.join(__dirname, "./src/**/*.{ts,js,mjs}"))

esbuild.build({
  entryPoints: entryFiles,
  format: "cjs",
  outdir: "dist",
  bundle: true,
  platform: "node",
  color: true,
  minify: false,
  external: ["@fastify/swagger"]
})

const esbuildAlias = options => {
  const aliases = Object.keys(options)
  const re = new RegExp(`^(${aliases.map(x => escapeRegExp(x)).join("|")})$`)

  return {
    name: "alias",
    setup(build) {
      // we do not register 'file' namespace here, because the root file won't be processed
      // https://github.com/evanw/esbuild/issues/791
      build.onResolve({ filter: re }, args => ({
        path: options[args.path]
      }))
    }
  }
}

function escapeRegExp(string) {
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
