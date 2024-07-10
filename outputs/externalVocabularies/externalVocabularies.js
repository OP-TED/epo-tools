import { UNDER_REVIEW } from '../../src/config.js'
import { getJson } from '../../src/epo/readEpo.js'
import { writeFileSync } from 'fs'

const model = UNDER_REVIEW
const g = getJson({ databasePath: model.databasePath })

function toMarkdown ({ edges }) {

  const externalAsDomain = edges.filter(
    ({ source, predicate }) => predicate.startsWith('epo') &&
      !source.startsWith('epo')).
    sort((a, b) => a.source.localeCompare(b.source))

  const edgeToMarkdownRow = edge => `|${edge.source}|${edge.predicate}|${edge.target}|`

  console.log('processed', externalAsDomain.length, 'rows')

  return `
# Usage of external vocabularies

## Model

\`\`\`json
${JSON.stringify(model, null, 2)}
\`\`\`

[source](./externalVocabularies.js) ${new Date().toISOString()}

## ePO relations using external vocabulary as Domain

It needs to be evaluated if some of these should be properties from a sub-class instead

| source | predicate | target |
| --- | --- | --- |
${externalAsDomain.map(edgeToMarkdownRow).join('\n')}

`
}

writeFileSync('outputs/externalVocabularies/external-vocabularies.md',
  toMarkdown(g))

