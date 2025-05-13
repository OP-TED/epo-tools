# ePO-tools

This repository is temporary and serves as a space for validation tools for EPO and some POCs

The intention is to eventually delete this repository once its purpose is fulfilled.

Any valuable components may be migrated to their respective repositories

## Notebook based reviews

To install dependencies

```shell
poetry install
```

To access the marimo notebooks

```sh
marimo edit  notebooks/
```

Currently there are notebooks to review SHACL, OWL and metadata of both.

## Web application

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




