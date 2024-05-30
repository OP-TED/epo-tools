import { EPO_LATEST, PRODUCTION, UNDER_REVIEW } from '../config.js'
import { fetchFromGithub } from './github.js'

await fetchFromGithub(EPO_LATEST)
await fetchFromGithub(UNDER_REVIEW)
await fetchFromGithub(PRODUCTION)
