import { hasPrefix } from '../prefix/prefix.js'
import { ATTRIBUTE, INHERITANCE } from './const.js'

function validateNode (node) {
  return hasPrefix(node.name) ? [] : [
    {
      severity: 'error', desc: `no prefix for ${node.name}`,
    }]
}

function validateEdge (edge) {
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

export { validateNode, validateEdge }
