// import { latestConceptualModel } from '../config.js'
// import { UNKNOWN } from '../namespaces.js'
// import { toTerm } from '../prefix/prefix.js'
//
// function withTerms (g) {
//   const { nodes, edges, ...tail } = g
//   return {
//     nodes: nodes.map(node => {
//       const { name, ...tail } = node
//       return {
//         ...tail, term: toTerm(name) ?? UNKNOWN(name),
//       }
//     }), edges: edges.map(edge => {
//       const { source, predicate, target, ...tail } = edge
//       return {
//         ...tail,
//         source: toTerm(source) ?? UNKNOWN(source),
//         predicate: toTerm(predicate) ?? UNKNOWN(predicate),
//         target: toTerm(target) ?? UNKNOWN(target),
//       }
//     }), ...tail,
//   }
// }
//
// const onlyEPO = latestConceptualModel()
//
// console.log(withTerms(onlyEPO))
//

