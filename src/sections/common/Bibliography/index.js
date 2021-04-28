export const definition = {
  id: 'bibliography',
  name: 'Bibliography',
  shortName: 'B',
  hasData: data => data.count > 0,
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
