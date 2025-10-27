# ePO-tools

This repository is temporary and serves as a space for validation tools for EPO and some POCs

The intention is to eventually delete this repository once its purpose is fulfilled.

Any valuable components may be migrated to their respective repositories

## Python

Install `python >=3.12` and `pip` or `uv`

## Notebook based reviews

To install dependencies using [UV](https://github.com/astral-sh/uv)

```shell
uv sync
```

To access the marimo notebooks

```sh
uv run marimo edit notebooks/
```

Currently there are notebooks to review SHACL, OWL and metadata of both.

### Post-processing step. 

Until Model2Owl is in place, there is a Marimo notebook that performs the postprocessing and packaging of the artefacts.

For this: 

1. Run [notebooks/fetch-assets.py](./notebooks/fetch-assets.py) to fetch the OWL 


## Web application

This repository contains an Ontology explorer, to be replaced by Model2Owl developments in the future.

The scripts require node.js installed and npm

Install dependencies

```sh
npm install
```

```sh
npm run dev
```

Will run the application to compare two conceptual models and more

- [Demo](https://docs.ted.europa.eu/epo-tools/)

### Add a new model version to the application

1. Add the model to the [repositories](./repositories.js) list
2. Run `node src/updateModels.js`, this will produce a json file for each model
3. Commit and push the files to the repository
   - Alternatively, run it locally with `npm run dev`
