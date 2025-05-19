# ePO-tools

This repository is temporary and serves as a space for validation tools for EPO and some POCs

The intention is to eventually delete this repository once its purpose is fulfilled.

Any valuable components may be migrated to their respective repositories

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




