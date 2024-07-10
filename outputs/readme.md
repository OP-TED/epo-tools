## To run

1. Install the dependencies

```sh
npm install
```

2. Download a local copy of the model

Configure the model to be checked at: [src/config.js](../src/config.js). It contain references to the github repo and branch.

It can be fetched locally through [src/download/fetchRepos.js](../src/download/fetchRepos.js)

3. Generate the SHACL shapes for comparison

Done through [outputs/writeShacl.js](../outputs/writeShacl.js)

## To check for mistmatches

To check for mistmatches between SHACL and the eAP 

[outputs/missing/checkMissingExports.js](./missing/checkMissingExports.js)

It will write a report at [outputs/missing/missingPropsSummaryCounts.md](./missing/missingPropsSummaryCounts.md)
