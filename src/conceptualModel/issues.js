import { hasPrefix } from '../prefix/prefix.js'
import { ATTRIBUTE, INHERITANCE } from './const.js'

function _appendIssues (list, keyFn, issueInspect) {
  const unique = new Map()
  for (const element of list) {
    const key = keyFn(element)
    if (unique.has(key)) {
      const existingEntry = unique.get(key)
      const { issues = [], ...rest } = existingEntry
      const newIssue = {
        severity: 'warning',
        desc: 'has a duplicate',
      }
      unique.set(key, {
        ...rest,
        issues: [...issues, newIssue],
      })

    } else {
      unique.set(key, {
        ...element,
        issues: issueInspect(element),
      })
    }
  }
  return Array.from(unique.values())
}

/**
 * Remove duplicates and append issues
 */
function appendIssues (g) {
  const { nodes, edges, ...tail } = g
  return {
    nodes: _appendIssues(nodes,
      (x) => x.name
      , inspectNode),
    edges: _appendIssues(edges,
      (x) => `${x.source}--${x.predicate}-->${x.target}`
      , inspectEdge),
    ...tail,
  }
}

function inspectNode (node) {
  return hasPrefix(node.name) ? [] : [
    {
      severity: 'error', desc: `no prefix for ${node.name}`,
    },
  ]
}

function inspectEdge (edge) {
  const {
    type, source, predicate, target, quantifiers: { quantifiersDeclared },
  } = edge
  const result = []

  const requiresTargetPrefix = type !== ATTRIBUTE
  const requiresPredicate = type !== INHERITANCE
  const requiresQuantifiers = type !== INHERITANCE

  if (!quantifiersDeclared && requiresQuantifiers) {
    result.push({
      severity: 'warning', desc: `No quantifiers defined`,
    })
  }
  if (!source) {
    result.push({
      severity: 'error', desc: `No source defined`,
    })
  } else if (!hasPrefix(source)) {
    result.push({
      severity: 'error', desc: `No prefix for source [${source}]`,
    })
  }

  if (requiresPredicate) {
    if (!predicate) {
      result.push({
        severity: 'error', desc: `No predicate defined`,
      })
    } else if (!hasPrefix(predicate)) {
      result.push({
        severity: 'error', desc: `No prefix for predicate [${predicate}]`,
      })
    }
  }

  if (!target) {
    result.push({
      severity: 'error', desc: `No target defined`,
    })
  } else if (requiresTargetPrefix && !hasPrefix(target)) {
    result.push({
      severity: 'error', desc: `No prefix for target [${target}]`,
    })
  }

  return result
}

export { appendIssues, inspectEdge, inspectNode }
