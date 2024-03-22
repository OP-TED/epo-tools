import { readFileSync, writeFileSync } from 'fs'
import MDBReader from 'mdb-reader'
import { UNDER_REVIEW } from '../config.js'
import { Parser } from 'n3'
import { prettyPrintTurtle } from '../io/serialization.js'
import rdf from 'rdf-ext'

const assetsPath = UNDER_REVIEW.localDirectory

const databasePath = `${assetsPath}/analysis_and_design/conceptual_model/ePO_CM.eap`
console.log('reading database', databasePath)

const buffer = readFileSync(databasePath)
const reader = new MDBReader(buffer)

const subjects = reader.getTable('t_object').getData()
const predicates = reader.getTable('t_connector').getData()
const attributes = reader.getTable('t_attribute').getData()

const lines = []
const objectIndex = {}
for (const { Object_ID, Name, Note } of subjects) {
  if (Name) {
    objectIndex[Object_ID] = Name
    if (Name.startsWith('epo')) {
      if (Note) {
        // lines.push(`${Name} skos:definition """${Note}""" .`)
        lines.push(`${Name} a owl:Class .`)
        // lines.push(`${Name} skos:definition "Cuek" .`)

      }
    }
  }
}

for (const {
  Object_ID, Name, Notes, LowerBound, UpperBound, Type
} of attributes) {
  const entity = objectIndex[Object_ID]
  if (Name.split(':').length === 2 && entity) {
    lines.push(`
    ${Name} a owl:ObjectProperty ;
        rdfs:domain  ${entity} ;
        rdfs:range  ${Type} .
    
    ${Name}Shape a sh:PropertyShape ;
      sh:path ${Name} ;
      sh:datatype ${Type} .
    `)
    if (LowerBound) {
      lines.push(`${Name}Shape sh:minCount ${LowerBound} .`)
    }
    if (UpperBound && UpperBound !== '*') {
      lines.push(`${Name}Shape sh:maxCount ${UpperBound} .`)
    }
    if (Notes) {
      lines.push(`${Name} skos:definition  """${Notes}""" .`)
    }

  } else {
    console.log(Name)
  }
}

function getQuantifier (value) {
  if (value === '0..1') {
    return { min: 0, max: 1 }
  } else if (value === '1') {
    return { min: 1, max: 1 }
  } else if (value === '1..*') {
    return { min: 1 }
  }
  return {}
}

for (const {
  Name,
  Direction,
  Notes,
  DestCard,
  SourceRole,
  DestRole,
  Start_Object_ID,
  End_Object_ID
} of predicates) {

  if (SourceRole || DestRole) {
    // console.log(DestCard, SourceRole, DestRole, objectIndex[Start_Object_ID],
    //   objectIndex[End_Object_ID])
  }
}

const turtle = `
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix dct: <http://purl.org/dc/terms/> . # Armonize this!
@prefix foaf: <http://xmlns.com/foaf/0.1/> .

@prefix epo: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-ord: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-ful: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-con: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-cat: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-not: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-acc: <http://data.europa.eu/a4g/ontology#> .
@prefix epo-sub: <http://data.europa.eu/a4g/ontology#> .
@prefix locn: <http://www.w3.org/ns/locn#> .
@prefix cccev: <http://data.europa.eu/m8g/> .
@prefix cv: <http://data.europa.eu/m8g/> . # Armonize this!
@prefix time: <http://www.w3.org/2006/time#> .
@prefix org: <http://www.w3.org/ns/org#> .
@prefix eli: <http://data.europa.eu/eli/ontology#> .
@prefix person: <http://www.w3.org/ns/person#> .
@prefix adms: <http://www.w3.org/ns/adms#> .

@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix a4g_shape: <http://data.europa.eu/a4g/data-shape#> .
@prefix cpov: <http://data.europa.eu/m8g/cpov> . # Is this true?

${lines.join('\n')}
`

writeFileSync(`assets/debug.ttl`, turtle)

const dataset = rdf.dataset().addAll([...new Parser().parse(turtle)])
const pretty = await prettyPrintTurtle({ dataset })
console.log(pretty)
