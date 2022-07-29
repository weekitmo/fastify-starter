import fs from "fs"

let isDockerCached: boolean

function hasDockerEnv() {
  try {
    fs.statSync("/.dockerenv")
    return true
  } catch {
    return false
  }
}

function hasDockerCGroup() {
  try {
    return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker")
  } catch {
    return false
  }
}

export default function isDocker() {
  if (isDockerCached === undefined) {
    isDockerCached = hasDockerEnv() || hasDockerCGroup()
  }

  return isDockerCached
}
