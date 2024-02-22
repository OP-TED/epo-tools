# Dereferencing

State of affairs.

## Docs

https://diataxis.fr/

### Authority tables

Try for instance the
concept [Ice cream](https://op.europa.eu/en/web/eu-vocabularies/concept/-/resource?uri=http://eurovoc.europa.eu/303)

```sh
curl -H "Accept: application/rdf+xml" "http://publications.europa.eu/resource/authority/eurovoc/303"

curl -H "Accept: text/html" "http://publications.europa.eu/resource/authority/eurovoc/303"

curl -H "Accept: text/turtle" "http://publications.europa.eu/resource/authority/eurovoc/303"
```

### Agrovoc

It's shown through the portal (https://agrovoc.fao.org/browse/agrovoc/en/page/?clang=it&uri=c_3784)

```sh
curl -H "Accept: application/rdf+xml" "http://aims.fao.org/aos/agrovoc/c_3784"

curl -H "Accept: text/html" "http://aims.fao.org/aos/agrovoc/c_3784"

curl -H "Accept: text/turtle" "http://aims.fao.org/aos/agrovoc/c_3784"
```
