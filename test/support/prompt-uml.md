I'm giving you a plantUML description, describing UML we use to represent classes and properties

There are some rules:

1. If a class extends from other, then it inherits all their properties, for example, given the following UML

```plantuml
class "ex:Bob" {

}
class "ex:Dog" {
    ex:hasNickname : rdf:PlainLiteral [0..3]
}

"ex:Dog" <|-- "ex:Bob"
```

We know a dog might have up to 3 nicknames. Bob is a dog, therefore it can have such nicknames.

Ok, here is the description of our UML.

{{plantuml}}

I'm interested in getting data about the main classifications of a procedure. In particular I want the main
classifications connected to all the notice published on "20230911". If you can, give me the distributions using counts
and groups

Assume I have a triplestore with the data in and Give me SPARQL I can run.
In your queries use the following prefixes:

```turtle
PREFIX epo: <http://data.europa.eu/a4g/ontology#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX euvoc: <http://publications.europa.eu/ontology/euvoc#>
PREFIX at: <http://publications.europa.eu/resource/authority/concept-status/>
```

Always use the attributes described in the UML, do NOT add new ones. Also use predicates where appropiate according to
the UML.

Always answer me in markdown.
