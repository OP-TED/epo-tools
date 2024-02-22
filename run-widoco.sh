wget -c https://github.com/dgarijo/Widoco/releases/download/v1.4.21/widoco-1.4.21-jar-with-dependencies_JDK-17.jar -O node_modules/widoco.jar
java -jar node_modules/widoco.jar -ontFile assets/ePO/implementation/ePO_core/owl_ontology/ePO_core.ttl -outFolder widoco -getOntologyMetadata -webVowl -displayDirectImportsOnly
