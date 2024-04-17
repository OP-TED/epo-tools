## Me

I'm giving you a SHACL description, describing the shape we use to represent our RDF

There are some implicit rules:

1. If a class extends from other, then it inherits all their properties, for example, given the following turtle

```turtle

ex:BobShape a shacl:NodeShape ;
	shacl:targetClass a4g:Bob .

ex:Dog a shacl:NodeShape ;
	shacl:targetClass ex:Dog ;
	shacl:property [
		rdf:type shacl:PropertyShape ;
		shacl:path ex:hasNickname  ;
		shacl:datatype rdf:PlainLiteral ;
		shacl:minCount 0 ;
		shacl:maxCount 3 ;
	] .


ex:Bob rdfs:subClassOf ex:Dog .
```

We know a dog might have up to 3 nicknames. Bob is a dog, therefore it can have such nicknames.

Ok, here is the description of our SHACL.

{{shacl}}

I'm interested in getting data about a Procedure. First of all, how do I get the associated titles?

Assume I have a triplestore with the data in. Give me SPARQL I can run. Always answer me in markdown.

## GPT

To retrieve the titles associated with a Procedure from your RDF triplestore, you can use a SPARQL query to match the
Procedure instances and extract their titles. The title information for each Procedure is stored under the dcterms:title
property, based on your SHACL shapes. Here's a SPARQL query that should work for this purpose:

```sparql
PREFIX a4g: <http://data.europa.eu/a4g/ontology#>
PREFIX dcterms: <http://purl.org/dc/terms/>

SELECT ?procedure ?title
WHERE {
?procedure a a4g:Procedure .
?procedure dcterms:title ?title .
}
```

Explanation:

    PREFIX a4g: <http://data.europa.eu/a4g/ontology#> and PREFIX dcterms: <http://purl.org/dc/terms/>: These lines define the namespaces for the prefixes used in the query to make the URI references shorter and more readable.
    ?procedure a a4g:Procedure: This pattern matches any resource that is a type of a4g:Procedure.
    ?procedure dcterms:title ?title: This pattern matches the title of the procedure, binding the title to the variable ?title.

Run this query in your SPARQL endpoint to fetch the titles of all procedures stored in your triplestore.
