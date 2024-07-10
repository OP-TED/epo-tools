
# Usage of external vocabularies

## Model

```json
{
  "owner": "OP-TED",
  "repo": "ePO",
  "branch": "develop",
  "localPath": "assets/ePO/develop",
  "databasePath": "assets/ePO/develop/analysis_and_design/conceptual_model/ePO_CM.eap"
}
```

[source](./externalVocabularies.js) 2024-07-10T11:13:34.475Z

## ePO relations using external vocabulary as Domain

It needs to be evaluated if some of these should be properties from a sub-class instead

| source | predicate | target |
| --- | --- | --- |
|adms:Identifier|epo:hasScheme|rdf:PlainLiteral|
|adms:Identifier|epo:hasSchemeVersion|rdf:PlainLiteral|
|cccev:Constraint|epo:hasThresholdValue|xsd:decimal|
|cccev:Constraint|epo:hasThresholdType|at-voc:number-threshold|
|cccev:Evidence|epo:hasURL|xsd:anyURI|
|cccev:Evidence|epo:hasValidityPeriod|epo:Period|
|cccev:InformationRequirement|epo:hasConstraint|cccev:Constraint|
|cpov:ContactPoint|epo:hasContactName|rdf:PlainLiteral|
|cpov:ContactPoint|epo:hasFax|rdf:PlainLiteral|
|cpov:ContactPoint|epo:hasInternetAddress|xsd:anyURI|
|cv:Channel|epo:hasAddressURL|xsd:anyURI|
|cv:Channel|epo:hasEndpointIdentifier|adms:Identifier|
|dct:Location|epo:hasNutsCode|at-voc:nuts|
|dct:Location|epo:hasCountryCode|at-voc:country|
|eli:LegalResource|epo:hasResourceType|at-voc:resource-type|
|eli:LegalResourceSubdivision|epo:hasSubdivision|at-voc:subdivision|
|foaf:Agent|epo:hasAlias|rdf:PlainLiteral|
|foaf:Person|epo:hasCertification|epo:Certificate|
|locn:Address|epo:hasNutsCode|at-voc:nuts|
|locn:Address|epo:hasCountryCode|at-voc:country|
|org:Organization|epo:hasMainActivityDescription|rdf:PlainLiteral|
|org:Organization|epo:hasBuyerLegalTypeDescription|rdf:PlainLiteral|
|org:Organization|epo:hasInternetAddress|xsd:anyURI|
|org:Organization|epo:hasLegalFormType|rdf:PlainLiteral|
|org:Organization|epo:hasLegalName|rdf:PlainLiteral|
|org:Organization|epo:hasRegistrationCountry|at-voc:country|
|org:Organization|epo:hasPrimaryContactPoint|cpov:ContactPoint|
|org:Organization|epo:hasBuyerLegalType|at-voc:buyer-legal-type|
|org:Organization|epo:hasMainActivity|at-voc:main-activity|
|org:Organization|epo:hasCertification|epo:Certificate|
|org:Organization|epo:canProvideTaxAndSocialSecuritiesEvidence|cccev:Evidence|
|org:Organization|epo:canProvideNonDiscriminatoryEvidence|cccev:Evidence|
|org:Organization|epo:hasLegalIdentifier|adms:Identifier|
|org:Organization|epo:hasTaxIdentifier|adms:Identifier|
|person:Person|epo:hasNationality|at-voc:country|
|person:Person|epo:hasCountryOfBirth|at-voc:country|

