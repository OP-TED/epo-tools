import { EPO_LATEST, UNDER_REVIEW } from '../config.js'
import { fetchFromGithub } from './github.js'

await fetchFromGithub(EPO_LATEST)
await fetchFromGithub(UNDER_REVIEW)
