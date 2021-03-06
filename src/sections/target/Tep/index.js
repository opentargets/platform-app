export const definition = {
  id: 'tep',
  name: 'Target Enabling Packages',
  shortName: 'TEP',
  hasData: data => !!data.tep,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
