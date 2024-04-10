import { ATTRIBUTE, INHERITANCE } from '../const.js'
import { hasPrefix } from '../views/prefix.js'

function addNodeWarnings (node) {
  const warnings = hasPrefix(node.name) ? [] : [
    {
      severity: 'error', desc: `no prefix for ${node.name}`,
    }]
  return { ...node, warnings }
}

function addEdgeWarnings (edge) {
  const {
    type, source, predicate, target, quantifiers: { quantifiersDeclared },
  } = edge
  const warnings = []

  const requiresTargetPrefix = type !== ATTRIBUTE
  const requiresPredicate = type !== INHERITANCE
  const requiresQuantifiers = type !== INHERITANCE

  if (!quantifiersDeclared && requiresQuantifiers) {
    warnings.push({
      severity: 'warning', desc: `No quantifiers defined`,
    })
  }
  if (!source) {
    warnings.push({
      severity: 'error', desc: `No source defined`,
    })
  } else if (!hasPrefix(source)) {
    warnings.push({
      severity: 'error', desc: `No prefix for source [${source}]`,
    })
  }

  if (requiresPredicate) {
    if (!predicate) {
      warnings.push({
        severity: 'error', desc: `No predicate defined`,
      })
    } else if (!hasPrefix(predicate)) {
      warnings.push({
        severity: 'error', desc: `No prefix for predicate [${predicate}]`,
      })
    }
  }

  if (!target) {
    warnings.push({
      severity: 'error', desc: `No target defined`,
    })
  } else if (requiresTargetPrefix && !hasPrefix(target)) {
    warnings.push({
      severity: 'error', desc: `No prefix for target [${target}]`,
    })
  }

  return { ...edge, warnings }
}

export { addEdgeWarnings, addNodeWarnings }
