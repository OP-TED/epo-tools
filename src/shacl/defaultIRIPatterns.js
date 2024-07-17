import { stripPrefix } from '../prefix/prefix.js'

function defaultSHACLShapeIRI (edge) {
  const { source } = edge
  return `a4g_shape:${stripPrefix(source)}Shape`
}

function defaultSHACLPropertyIRI (edge) {
  const { source, predicate, target } = edge
  // The following IRI structure was tried:
  //   http://data.europa.eu/a4g/shape/[target]-[path]
  //     where the target may be a node identified as an implicit or explicit target defined by sh:targetClass (e.g., ProcurementObject).
  //     For example, a shape that checks the property epo:isUsingEUFunds when applied to epo:ProcurementObject will be identified as follows:
  //   http://data.europa.eu/a4g/shape/ProcurementObject-isUsingEUFunds
  // However it didn't work.
  // Properties might have distinct quantifiers depending on the Domain/Range combinations

  /**
   * @startuml
   * class "epo-ord:OrderResponse" {
   *   epo-ord:specifiesSeller : epo-ord:Seller [0..1]
   *   epo-ord:isSubmittedForOrder : epo-ord:Order [1]
   * }
   * class "epo-cat:Catalogue" {
   *   epo:specifiesSeller : epo-ord:Seller [0..*]
   * }
   * class "epo-ord:Seller" {
   *
   * }
   * class "epo-ord:Order" {
   *   epo:specifiesSeller : epo-ord:Seller [1]
   *   epo-ord:refersToCatalogue : epo-cat:Catalogue [0..*]
   * }
   * "epo-ord:Order" --> "1" "epo-ord:Seller" : epo:specifiesSeller
   * "epo-ord:Order" --> "0..*" "epo-cat:Catalogue" : epo-ord:refersToCatalogue
   * "epo-ord:OrderResponse" --> "0..1" "epo-ord:Seller" : epo-ord:specifiesSeller
   * "epo-cat:Catalogue" --> "0..*" "epo-ord:Seller" : epo:specifiesSeller
   * "epo-ord:OrderResponse" --> "1" "epo-ord:Order" : epo-ord:isSubmittedForOrder
   * @enduml
   */
  return `a4g_shape:${stripPrefix(source)}-${stripPrefix(
    predicate)}-${stripPrefix(target)}`
}

export { defaultSHACLShapeIRI, defaultSHACLPropertyIRI }
