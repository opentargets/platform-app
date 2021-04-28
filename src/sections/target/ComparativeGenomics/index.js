export const definition = {
  id: 'orthologs',
  name: 'Comparative Genomics',
  shortName: 'CG',
  hasData: data => {
    console.log('hasData data', data);
    return data.orthologueCount > 0;
  },
};

export { default as Summary } from './Summary';
export { default as Body } from './Body';
