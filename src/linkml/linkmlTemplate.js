import { stringify } from 'yaml'
import { INHERITANCE, RELATIONSHIP } from '../conceptualModel/const.js'

function toLinkML ({ nodes, edges }) {
  const result = {
    id: 'https://example.org/linkml/schema',
    name: 'ExampleSchema',
    prefixes: {
      linkml: 'https://w3id.org/linkml/',
    },
    imports: ['linkml:types'],
    default_range: 'string',
    classes: {},
  }

  nodes.forEach(node => {
    const nodeClass = { attributes: {} }
    const classPredicates = edges.filter(edge => edge.source === node.name)

    classPredicates.forEach(edge => {
      if (edge.type === INHERITANCE) {
        nodeClass.is_a = edge.target
      } else if (edge.type === RELATIONSHIP) {
        nodeClass.attributes[edge.predicate] = {
          range: edge.target,
          ...(edge.quantifiers ? {
            multivalued: edge.quantifiers.min > 1 || edge.quantifiers.max > 1,
          } : {}),
        }
      }
    })

    result.classes[node.name] = nodeClass
  })

  return stringify(result)
}

export { toLinkML }
