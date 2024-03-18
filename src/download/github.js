import fs from 'fs'
import tar from 'tar'
import got from 'got'

const lookupLatestRelease = async (owner, repo) => {
  try {
    const response = await got(
      `https://api.github.com/repos/${owner}/${repo}/releases/latest`, {
        responseType: 'json',
      })
    const { tag_name, tarball_url } = response.body
    return { tag: tag_name, tarballUrl: tarball_url }
  } catch (error) {
    console.error('Error getting the latest release asset URL:', error.message)
    throw error
  }
}

async function writeLocal ({ repo, tarballUrl, localDirectory }) {
  try {
    fs.rmSync(localDirectory, { recursive: true, force: true })
    fs.mkdirSync(localDirectory, { recursive: true })
  } catch (error) {
    console.error('Error updating directory:', error.message)
    process.exit(1)
  }
  try {
    const response = await got.stream(tarballUrl)
    response.pipe(tar.x({
      strip: 1, C: localDirectory,
    }))
    console.log('fetching', tarballUrl, 'into', localDirectory)
  } catch (error) {
    console.error('Error updating latest release:', error.message)
    process.exit(1)
  }
}

async function fetchLatestRelease ({ owner, repo, localDirectory }) {
  const { tag, tarballUrl } = await lookupLatestRelease(owner, repo)
  console.log('latest tag for ', owner, repo, 'is', tag)
  return await writeLocal({ repo, tarballUrl, localDirectory })
}

async function fetchFromTag ({ owner, repo, tag, localDirectory }) {
  const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.tar.gz`
  return await writeLocal({ repo, tarballUrl, localDirectory })
}

async function fetchFromBranch ({ owner, repo, branch, localDirectory }) {
  const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.tar.gz`
  await writeLocal({ repo, tarballUrl, localDirectory })
}

async function fetchFromGithub (target) {
  if (target.latest) {
    return fetchLatestRelease(target)
  } else if (target.branch) {
    return fetchFromBranch(target)
  } else if (target.tag) {
    return fetchFromTag(target)
  }
  throw Error('Invalid repo')
}

export { fetchFromGithub }
