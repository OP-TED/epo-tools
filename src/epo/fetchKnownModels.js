import { fetchFromGithub } from '../download/github.js'
import { repositories } from './knownEpo.js'

repositories.forEach(fetchFromGithub)
