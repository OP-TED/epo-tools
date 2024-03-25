import { UNDER_REVIEW } from '../config.js'
import { extract } from './extractFromEA.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const { classes, predicates, attributes } = extract({ databasePath })

const noQuantifiers = x => (x.predicate !== 'rdfs:subClassOf' && x.noQuantifier)

function noCuries (x) {
  return !((x.source.split(':') !== 2) || (x.predicate.split(':') !== 2) ||
    (x.target.split(':') !== 2))
}

console.log('Attributes quantifiers')
console.log(attributes.filter(noQuantifiers))
console.log('Predicates quantifiers')
console.log(predicates.filter(noQuantifiers))

console.log('Attributes curies')
console.log(attributes.filter(noCuries))
console.log('Predicates curies')
console.log(predicates.filter(noCuries))

