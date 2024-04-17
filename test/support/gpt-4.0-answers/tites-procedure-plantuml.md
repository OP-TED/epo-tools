## Me

Ok, let's try another thing.

I'm giving you a plantUML description, describing UML we use to represent classes and properties

There are some rules:

1. If a class extends from other, then it inherits all their properties, for example, given the following UML

```plantuml
class "ex:Bob" {

}
class "ex:Dog" {
    ex:hasNicknae : rdf:PlainLiteral [0..3]
}

"ex:Dog" <|-- "ex:Bob"
```

We know a dog might have up to 3 nicknames. Bob is a dog, therefore it can have such nicknames.

Ok, here is the description of our UML.

{{plantuml}}

I'm interested in getting data about a Procedure. First of all, how do I get the associated titles?

Assume I have a triplestore with the data in. Give me SPARQL I can run. Always answer me in markdown.

## GPT

To query for the titles associated with a Procedure in a triplestore using SPARQL, you will focus on extracting the
titles from instances of the Procedure class or its subclasses if any inheritance is applicable. From the UML you
provided, titles are managed under the class ProcurementElement, and since Procedure is a subclass of
ProcurementElement, it inherits the dct:title property.

Here is the SPARQL query that retrieves the titles associated with any Procedure:

```sparql

PREFIX epo: <http://example.com/epo#>
PREFIX dct: <http://purl.org/dc/terms/>

SELECT ?procedure ?title
WHERE {
  ?procedure a epo:Procedure ;  # Selects instances of Procedure
             dct:title ?title .  # Gets the title of each Procedure
}
```

This query assumes that:

    epo: is the prefix used for your specific ontology as per your UML.
    dct: is the commonly used prefix for the Dublin Core Terms, where the title property is defined.

Make sure your namespace prefixes (epo: and dct:) are correctly defined in your SPARQL endpoint to match the URIs used
in your data. This query will return a list of procedures along with their titles.
