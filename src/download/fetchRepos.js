import { EPO_LATEST, EPO_3_1_0, UNDER_REVIEW } from '../config.js'
import { fetchFromGithub } from './github.js'

await fetchFromGithub(EPO_LATEST)
await fetchFromGithub(UNDER_REVIEW)
await fetchFromGithub(EPO_3_1_0)
