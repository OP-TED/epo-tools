import { EPO } from '../variables.js'
import { fetchLatestRelease } from './github.js'

await fetchLatestRelease(EPO)
