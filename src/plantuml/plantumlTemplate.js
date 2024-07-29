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
${maybeSorted(classDefinitions).join('\n\n')}
${maybeSorted(noDuplicates(relations)).join('\n')}
@enduml
`
}

function noSpacesNoSlashes (name) {
  return name.replaceAll(' ', '_').replaceAll('-','_')
}

const nodeTemplate = ({ name }, edges) => `class "${noSpacesNoSlashes(name)}" {
${noDuplicates(edges.map(
  x => `  ${noSpacesNoSlashes(x.predicate)} : ${noSpacesNoSlashes(x.target)} ${displayQuantifiers(x.quantifiers,
    x => `[${x}]`)}`)).join('\n')}
}`

const enumTemplate = ({ name }, edges) => `enum "${noSpacesNoSlashes(name)}" {
${noDuplicates(edges.map(
  x => `  ${noSpacesNoSlashes(x.predicate)}`)).join('\n')}
}`

const objectTemplate = ({ name }, edges) => `object ${noSpacesNoSlashes(name)} {
${noDuplicates(edges.map(
  x => `  ${noSpacesNoSlashes(x.predicate)} = ${noSpacesNoSlashes(x.target)}`)).join('\n')}
}`

const datatypeTemplate = ({ name }, edges) => `entity ${noSpacesNoSlashes(name)}`

const subclassTemplate = ({
  source, predicate, target,
}) => `"${noSpacesNoSlashes(target)}" <|-- "${noSpacesNoSlashes(source)}"`

const relationTemplate = ({
  source, predicate, target, quantifiers,
}) => `"${noSpacesNoSlashes(source)}" --> ${displayQuantifiers(quantifiers,
  x => `"${x}"`)} "${noSpacesNoSlashes(target)}" ${displayPredicateName(predicate)}`

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
