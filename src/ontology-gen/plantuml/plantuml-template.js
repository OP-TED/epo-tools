import { INHERITANCE, RELATIONSHIP } from '../extractFromEA.js'

const nodeTemplate = ({ name }, edges) => `class "${name}" {
  ${edges.map(x => `${x.predicate} ${x.target}`).join('\n')}
}
`
const subclassTemplate = ({
  source, predicate, target,
}) => `"${source}" --|> "${target}"`

const relationTemplate = ({
  source, predicate, target,
}) => `"${source}" --> "${target}"`

function getPlantUML ({ nodes, edges }) {

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
${relations.join('\n')}
@enduml
`
}

export { getPlantUML }
