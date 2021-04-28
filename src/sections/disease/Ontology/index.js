export const definition = {
  id: 'ontology',
  name: 'Ontology',
  shortName: 'O',
  // All terms are in the ontology.
  hasData: () => true,
};

export { default as Body } from './Body';
export { default as Summary } from './Summary';
