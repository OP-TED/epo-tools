import { UNDER_REVIEW } from '../config.js'
import { extract } from './extractFromEA.js'

const assetsPath = UNDER_REVIEW.localDirectory
const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
const { classes, predicates, attributes } = extract({ databasePath })

const noQuantifiers = x => (x.predicate !== 'rdfs:subClassOf' && x.noQuantifier)

function hasCurieError (x) {

  if (x.split(':').length !== 2) {
    return true
  }
  // TODO check known prefixes
  // if (x.source.split(':')[0] === 'epo-ord') {
  //   return true
  // }

}

console.log('--- Checking quantifiers')
console.log('Attributes')
console.log(attributes.filter(noQuantifiers))
console.log('Predicates')
console.log(predicates.filter(noQuantifiers))

console.log('--- Checking curies')

console.log('Entities')
console.log(classes.filter(x => hasCurieError(x.name)))
console.log('Attributes')
console.log(
  attributes.filter(x => hasCurieError(x.source) || hasCurieError(x.target)))
console.log('Predicates')
console.log(
  predicates.filter(x => hasCurieError(x.source) || hasCurieError(x.target)))

