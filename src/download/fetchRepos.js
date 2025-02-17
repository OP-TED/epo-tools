import { EPO_LATEST } from '../config.js'
import { fetchFromGithub } from './github.js'

await fetchFromGithub(EPO_LATEST)
