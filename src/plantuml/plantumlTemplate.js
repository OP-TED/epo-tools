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

    const templates = {
      'Enumeration': enumTemplate,
      'Class': nodeTemplate,
      'Object': objectTemplate,
      'DataType': datatypeTemplate,
    }

    const template = templates[node.type]
    return (shrink && classPredicates.length === 0) ? undefined : template(
      node,
      classPredicates)
  }).filter(x => x)

  const relations = [
    ...edges.filter(x => x.type === INHERITANCE).map(subclassTemplate),
    ...edges.filter(
      x => !shrink && (x.type !== INHERITANCE && x.type !== ATTRIBUTE)).
      map(relationTemplate)]

  return `
@startuml
skinparam object {
    BackgroundColor LightYellow
}
${maybeSorted(classDefinitions).join('\n\n')}
${maybeSorted(noDuplicates(relations)).join('\n')}
@enduml
`
}

// To defeat a tragic inconsistency of plantuml regarding objects and datatypes
function sanitize (name) {
  return name.replaceAll(' ', '_')
  .replaceAll('-', '_')
  .replaceAll('(', '_')
  .replaceAll(')', '_')
  .replaceAll('/', '_');
}

const nodeTemplate = (
  { name }, edges) => `class "${name}" as ${sanitize(name)} {
${noDuplicates(edges.map(
  x => `  ${x.predicate} : ${x.target} ${displayQuantifiers(x.quantifiers,
    x => `[${x}]`)}`)).join('\n')}
}`

const enumTemplate = (
  { name }, edges) => `enum "${name}" as ${sanitize(name)} {
${noDuplicates(edges.map(
  x => `  ${x.predicate}`)).join('\n')}
}`

const objectTemplate = (
  { name }, edges) => `object "${name}" as ${sanitize(name)} {
${noDuplicates(edges.map(
  x => `  ${x.predicate} = ${x.target}`)).join('\n')}
}`

const datatypeTemplate = (
  { name }, edges) => `entity "${name}" as ${sanitize(name)}`

const subclassTemplate = ({
  source, predicate, target,
}) => `"${sanitize(target)}" <|-- "${sanitize(source)}"`

const relationTemplate = ({
  source, predicate, target, quantifiers,
}) => `"${sanitize(source)}" --> ${displayQuantifiers(quantifiers,
  x => `"${x}"`)} "${sanitize(target)}" ${displayPredicateName(
  predicate)}`

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
