#!/bin/bash

#sudo apt-get update
#sudo apt-get install raptor2-utils

# Specify the directory where the Turtle files are located
inputDirectory="./result"

# Find all .ttl files in the specified directory and its subdirectories
find "$inputDirectory" -type f -name "*.ttl" | while read ttlFile; do
  # Get the directory where the Turtle file is located
  fileDirectory=$(dirname "$ttlFile")

  # Get the base name of the file (without extension)
  baseName=$(basename "$ttlFile" .ttl)

  # Define the output RDF/XML file path (same directory as the Turtle file)
  rdfXmlFile="${fileDirectory}/${baseName}.rdf"

  # Use Raptor's rapper command to convert Turtle to RDF/XML
  rapper -i turtle "$ttlFile" -o rdfxml > "$rdfXmlFile"

  # Print the paths of the generated files
  echo "Generated RDF/XML: $rdfXmlFile"
done
