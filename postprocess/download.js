import { fetchFromGithub } from '../src/download/github.js'

import model from './model.json' with { type: 'json' }

await fetchFromGithub(model)
