#!/usr/bin/env node
import fs from "fs"
import path from "path"
import chalk from "chalk"
import { fileURLToPath } from "url"

const __filename = import.meta.url ? fileURLToPath(import.meta.url) : __filename
const __dirname = path.dirname(__filename)
const msgPath = path.join(__dirname, "../.git/COMMIT_EDITMSG")

const msg = fs.readFileSync(msgPath, "utf-8").trim()

const commitRE =
  /^(revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,60}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(`invalid commit message format.`)}\n\n` +
      chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
      `    ${chalk.green(`feat(package): add 'comments' option`)}\n` +
      `    ${chalk.green(`fix(:bugfix): handle something (close #28)`)}\n\n` +
      chalk.red(`  See ./commit-convention.md for more details.\n`)
  )
  process.exit(1)
}
