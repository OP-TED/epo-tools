import { EntityList } from 'rdf-entity-webcomponent'
import {
  render as renderWebComponent,
} from '@lit-labs/ssr'

function toTable ({ dataset, root, maxLevel }) {
  const resourceWebComponent = EntityList(
    { dataset, terms: root ? [root] : [] }, {
      embedBlankNodes: true,
      embedNamedNodes: true,
      maxLevel: maxLevel ?? 10,
      technicalCues: true,
      embedLists: true,
      showImages: true,
      simplifiedMode: false,
    })
  const stringIterator = renderWebComponent(resourceWebComponent)
  return Array.from(stringIterator).join('')
}

function toHTML ({ dataset, root, maxLevel }) {
  return `
<!DOCTYPE html>
<head>
<style>
body {
    --border: #463838;
    --metadata: #463838;
}
.rdf-container .entities {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border-right: 1px solid var(--border);
}

.rdf-container .entity {
    display: flex;
    flex-direction: column;
    border-left: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.rdf-container .entity-header {
    background: rgba(0, 0, 0, 0.05);
}

.rdf-container .entity-header > div {
    margin: 5px;
}

.rdf-container .rows {
    display: flex;
    flex-direction: column;
}

/* Alternate highlighting */
.rdf-container .rows > :nth-child(1n) {
    border-top: 1px solid var(--border);
}

/* Alternate highlighting */
.rdf-container .rows > :nth-child(2n) {
    border-top: 1px solid var(--border);
    background: rgba(0, 0, 0, 0.01);
}

.rdf-container .rows > .row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

.rdf-container .row > .property {
    align-self: flex-start;
    min-width: 200px;
    word-wrap: break-word;
    margin: 0.5rem 0.5rem 0.5rem 1%;
}

/* Values */
.rdf-container .row > .value {
    flex: 2;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
    margin-top: 0.5rem;
}

/* A Hack to select text */
.rdf-container .row > .value > li > div:not([class]) {
    /*border: 2px blue solid;*/
    word-wrap: break-word;
}

.rdf-container ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: 5px;
    justify-content: center;
    padding-left: 5px;
}

.rdf-container ol {
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
    padding-left: 5px;
}

div .bring-down {
    color: var(--metadata);
}

.vocab {
    color: var(--metadata);
    font-size: 0.8rem;
}

.vocab::after {
    content: ':';
}

.language {
    color: var(--metadata);
    font-size: 0.7rem;
    margin-left: 4px;
}

.datatype {
    color: var(--metadata);
    font-size: 0.7rem;
    margin-left: 4px;
}

.img-container {
    margin-left: auto;
    margin-right: auto;
}

.img-container img {
    max-width: 200px;
}
</style>
</head>
    <body>
    <div class="rdf-container">
            ${toTable({ dataset, root, maxLevel })}
    </div>
        
    </body>
</html>
  `
}

export { toHTML, toTable }
