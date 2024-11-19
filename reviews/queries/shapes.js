const selectShapesPerClass = (clazz) => `
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX epo: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-acc: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-cat: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-con: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-ful: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-not: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-ord: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-sub: <http://data.europa.eu/a4g/ontology#>
PREFIX epo-inv: <http://data.europa.eu/a4g/ontology#>
  
SELECT ?g ?shape ?source ?predicate ?datatypeTarget ?classTarget ?minCount ?maxCount {
  GRAPH ?g {
    BIND(${clazz} AS ?source)
    ?shape  sh:targetClass ?source ;
            sh:property  ?propertyShape .
    
    ?propertyShape a sh:PropertyShape ;
                   sh:path ?predicate .
                   
    OPTIONAL { ?propertyShape sh:minCount ?minCount } .
    OPTIONAL { ?propertyShape sh:maxCount ?maxCount } .
    OPTIONAL { ?propertyShape sh:datatype ?datatypeTarget } .
    OPTIONAL { ?propertyShape sh:class ?classTarget } .
  }
}
`
export { selectShapesPerClass }
