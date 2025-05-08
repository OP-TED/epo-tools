## UML notation mismatch

There seems to be a mismatch between how the ePO conceptual model (represented in UML) uses the generalization connector and how subclassing operates in OWL.

In OWL, property inheritance is well-defined. For example:

```
ex:hasParent a owl:ObjectProperty .
 
ex:hasMother a owl:ObjectProperty ;
    rdfs:subPropertyOf ex:hasParent .
 
ex:Alice has:Mother ex:Carol .
```

From this, we can infer:
`ex:Alice has:hasParent ex:Carol`

But the generalization connector as used by the modellers does not entail this inference, it most probably it means
overriding. The formal artifacts need to express the intended semantics of the modelers, and the conventions need to
formalize this

We should clarify this and discuss the necessary adjustments, probably adjusting the connector

### Example

Say the modeller relates isStepParentOf with isStepParentOf

OWL

```
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix ex: <http://example.org/ontology#> .

# Define the general property
ex:isParentOf a owl:ObjectProperty ;
    rdfs:label "is parent of" .

# Define the specific property
ex:isStepParentOf a owl:ObjectProperty ;
    rdfs:subPropertyOf ex:isParentOf ;
    rdfs:label "is step-parent of" .

# Ensure the two properties cannot coexist
ex:isParentOf owl:propertyDisjointWith ex:isStepParentOf .

# Individuals and relationships
ex:Alice a owl:NamedIndividual .
ex:Bob a owl:NamedIndividual .

# Assertion using the specific property
ex:Alice ex:isStepParentOf ex:Bob .
```
SHACL

```
@prefix sh: <http://www.w3.org/ns/shacl#> .
@prefix ex: <http://example.org/ontology#> .

# Define the general property shape
ex:ParentShape a sh:NodeShape ;
    sh:property [
        sh:path ex:isParentOf ;
        sh:message "A person cannot be both a parent and a step-parent of the same individual." ;
        sh:not [
            sh:property [
                sh:path ex:isStepParentOf ;
            ]
        ] ;
    ] .

# Define the specific property shape
ex:StepParentShape a sh:NodeShape ;
    sh:property [
        sh:path ex:isStepParentOf ;
        sh:message "A step-parent relationship overrides the parent relationship." ;
    ] .

# Individuals and relationships
ex:Alice a ex:Person .
ex:Bob a ex:Person .

# Data assertion
ex:Alice ex:isStepParentOf ex:Bob .
```
