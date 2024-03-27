function addNodeWarnings (node) {
  const warnings = hasCurie(node.name) ? [] : [
    {
      severity: 'error', desc: `no prefix for ${node.name}`,
    }]
  return { ...node, warnings }
}

function addEdgeWarnings (edge) {
  const {
    source, predicate, target, isLiteral, noQuantifiers,
  } = edge
  const warnings = []
  const requiresQuantifiers = predicate !== 'rdfs:subClassOf'
  const requiresTargetPrefix = !isLiteral

  if (noQuantifiers && requiresQuantifiers) {
    warnings.push({
      severity: 'error', desc: `No quantifiers defined`,
    })
  }
  if (!source) {
    warnings.push({
      severity: 'error', desc: `No source defined`,
    })
  } else if (!hasCurie(source)) {
    warnings.push({
      severity: 'error', desc: `No prefix for source [${source}]`,
    })
  }
  if (!predicate) {
    warnings.push({
      severity: 'error', desc: `No predicate defined`,
    })
  } else if (!hasCurie(predicate)) {
    warnings.push({
      severity: 'error', desc: `No prefix for predicate [${predicate}]`,
    })
  }
  if (!target) {
    warnings.push({
      severity: 'error', desc: `No target defined`,
    })
  } else if (requiresTargetPrefix && !hasCurie(target)) {
    warnings.push({
      severity: 'error', desc: `No prefix for target [${target}]`,
    })
  }

  return { ...edge, warnings }
}

function hasCurie (name) {
  if (name.split(':').length === 2) {
    return true
  }
}

export { addEdgeWarnings, addNodeWarnings }
