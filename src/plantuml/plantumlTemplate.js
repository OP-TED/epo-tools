import {
  ATTRIBUTE,
  INHERITANCE,
  RELATIONSHIP,
} from '../conceptualModel/const.js'

function toPlantuml ({ nodes, edges }, { shrink, sorted } = {
  includeRelationships: true, sorted: false,
}) {

  const maybeSorted = (arr) => sorted ? arr.sort() : arr

  const maybeSortedByPredicate = (arr) => sorted ? arr.sort(
    (a, b) => a.predicate?.localeCompare(b.predicate)) : arr

  const classDefinitions = nodes.map(node => {
    const classPredicates =
      maybeSortedByPredicate(
        edges.filter(edge => edge.source === node.name).
          filter(edge => edge.type !== INHERITANCE),
      )
    return (shrink && classPredicates.length === 0) ? undefined : nodeTemplate(
      node,
      classPredicates)
  }).filter(x => x)

  const relations = [
    ...edges.filter(x => x.type === INHERITANCE).map(subclassTemplate),
    ...edges.filter(x => !shrink && (x.type !== INHERITANCE && x.type !== ATTRIBUTE)).
      map(relationTemplate)]

  return `
@startuml
${maybeSorted(classDefinitions).join('\n\n')}
${maybeSorted(noDuplicates(relations)).join('\n')}
@enduml
`
}

const nodeTemplate = ({ name }, edges) => `class "${name}" {
${noDuplicates(edges.map(
  x => `  ${x.predicate} : ${x.target} ${displayQuantifiers(x.quantifiers,
    x => `[${x}]`)}`)).join('\n')}
}`

const subclassTemplate = ({
  source, predicate, target,
}) => `"${target}" <|-- "${source}"`

const relationTemplate = ({
  source, predicate, target, quantifiers,
}) => `"${source}" --> ${displayQuantifiers(quantifiers,
  x => `"${x}"`)} "${target}" ${displayPredicateName(predicate)}`

function displayQuantifiers ({ quantifiersDeclared, min, max, raw }, wrap) {
  if (quantifiersDeclared) {
    if (raw) { // prefer raw if declared
      return wrap(`${raw}`)
    } else if (min && max) {
      return wrap(`${min}..${max}`)
    } else if (min) {
      return wrap(`${min}..*`)
    } else if (max) {
      return wrap(`0..${max}`)
    }
  }
  return ''
}

const displayPredicateName = (predicate) => predicate ? `: ${predicate}` : ''

const noDuplicates = (arr) => [...new Set(arr)]

export { toPlantuml }
