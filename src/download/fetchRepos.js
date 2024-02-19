import { fetchLatestRelease } from './github.js'

await fetchLatestRelease({
  owner: 'OP-TED', repo: 'ePO', localDirectory: 'assets/ePO',
})
