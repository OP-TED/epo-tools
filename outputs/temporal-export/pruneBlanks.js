import { Parser } from 'n3'
import rdf from 'rdf-ext'

const parser = new Parser({ factory: rdf })

function toQuads (str) {
  return parser.parse(str)
}

const quads = toQuads(`

<a> <b> <c> .

<http://example.org> <b> _:b1202 .

_:b1202 a <t1> ;
	<p1> (
		<d>
		<e>
		<f>
	) .

_:b1206 a <t2> ;
	<p2> (
		<g>
		<h>
		<i>
	) .
`)

function prune (dataset, term) {
  const traverser = rdf.traverser(({
    dataset,
    level,
    quad,
  }) => level >= 0 && level <= 5)
  const traversed = rdf.dataset()
  traverser.forEach({ term: term, dataset: dataset },
    ({ dataset, level, quad }) => {
      traversed.add(quad)
    })
  return traversed
}

const dataset = rdf.dataset().addAll(quads)
const term = rdf.namedNode('http://example.org')
const traversed = prune(dataset, term)

console.log(traversed.toCanonical())



