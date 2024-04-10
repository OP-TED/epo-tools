import { INHERITANCE, RELATIONSHIP } from '../const.js'

const nodeTemplate = ({ name }, edges) => `class "${name}" {
${noDuplicates(edges.map(x => `  ${x.predicate} ${x.target}`)).join('\n')}
}`
const subclassTemplate = ({
  source, predicate, target,
}) => `"${target}" <|-- "${source}"`

const displayRawQuantifiers = (quantifiers) => quantifiers.quantifiersDeclared &&
quantifiers.raw ? `"${quantifiers.raw}"` : ''

const displayPredicateName = (predicate) => predicate ? `: ${predicate}` : ''

const relationTemplate = ({
  source, predicate, target, quantifiers,
}) => `"${source}" --> ${displayRawQuantifiers(
  quantifiers)} "${target}" ${displayPredicateName(predicate)}`

function toPlantuml ({ nodes, edges }) {

  const classDefinitions = nodes.map(node => {
    const nodeEdges = edges.filter(edge => edge.source === node.name).
      filter(edge => edge.type !== INHERITANCE)
    return nodeTemplate(node, nodeEdges)
  })

  const relations = [
    ...edges.filter(x => x.type === INHERITANCE).map(subclassTemplate),
    ...edges.filter(x => x.type === RELATIONSHIP).map(relationTemplate)]

  return `
@startuml
${classDefinitions.join('\n')}
${noDuplicates(relations).join('\n')}
@enduml
`
}

const noDuplicates = (arr) => [...new Set(arr)]

export { toPlantuml }
