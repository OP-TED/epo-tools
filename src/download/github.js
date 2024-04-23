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

async function writeLocal ({ tarballUrl, localPath }) {
  try {
    fs.rmSync(localPath, { recursive: true, force: true })
    fs.mkdirSync(localPath, { recursive: true })
  } catch (error) {
    console.error('Error updating path:', error.message)
    process.exit(1)
  }
  try {
    const response = await got.stream(tarballUrl)
    console.log('fetching', tarballUrl, 'into', localPath)
    const extractPromise = new Promise((resolve, reject) => {
      response.pipe(tar.x({
        strip: 1, C: localPath,
      })).on('end', () => resolve()).on('error', (error) => reject(error))
    })
    await extractPromise
  } catch (error) {
    console.error('Error updating latest release:', error.message)
    process.exit(1)
  }
}

async function fetchLatestRelease ({ owner, repo, localPath }) {
  const { tag, tarballUrl } = await lookupLatestRelease(owner, repo)
  console.log('latest tag for ', owner, repo, 'is', tag)
  return writeLocal({ tarballUrl, localPath })
}

async function fetchFromTag ({ owner, repo, tag, localPath }) {
  const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/tags/${tag}.tar.gz`
  return writeLocal({ tarballUrl, localPath })
}

async function fetchFromBranch ({ owner, repo, branch, localPath }) {
  const tarballUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${branch}.tar.gz`
  await writeLocal({ tarballUrl, localPath })
}

async function fetchFromGithub (target) {
  if (target.latest) {
    await fetchLatestRelease(target)
  } else if (target.branch) {
    await fetchFromBranch(target)
  } else if (target.tag) {
    await fetchFromTag(target)
  } else {
    throw Error('Invalid repo')
  }

}

export { fetchFromGithub }
