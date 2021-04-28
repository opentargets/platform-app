import React from 'react';
import { useEffect, useState } from 'react';

import SummaryItem from '../../../components/Summary/SummaryItem';
import usePlatformApi from '../../../hooks/usePlatformApi';

const speciesSubset = [
  'homo_sapiens',
  'pan_troglodytes',
  'macaca_mulatta',
  'mus_musculus',
  'rattus_norvegicus',
  'cavia_porcellus',
  'oryctolagus_cuniculus',
  'sus_scrofa',
  'canis_familiaris',
  'xenopus_tropicalis',
  'danio_rerio',
  'drosophila_melanogaster',
  'caenorhabditis_elegans',
];

function Summary({ definition, id: ensgId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [data, setData] = useState();
  const { externalData, setExternalData } = usePlatformApi();

  useEffect(
    () => {
      let isCurrent = true;

      fetch(
        `https://rest.ensembl.org/homology/id/${ensgId}.json?format=full;sequence=none;type=all;target_taxon=9606;target_taxon=10090;target_taxon=10141;target_taxon=9544;target_taxon=9615;target_taxon=9986;target_taxon=10116;target_taxon=9823;target_taxon=8364;target_taxon=7955;target_taxon=9598;target_taxon=7227;target_taxon=6239`
      )
        .then(
          res => res.json(),
          err => {
            setError(err);
            setLoading(false);
          }
        )
        .then(data => {
          const { homologies } = data.data[0];
          let orthologueCount = 0;
          const speciesSet = new Set();

          homologies.forEach(homology => {
            if (
              homology.type === 'ortholog_one2one' ||
              homology.type === 'ortholog_one2many'
            ) {
              orthologueCount++;
            }

            if (speciesSubset.includes(homology.target.species)) {
              speciesSet.add(homology.target.species);
            }
          });

          if (isCurrent) {
            setData({ orthologueCount, numSpecies: speciesSet.size });
            setExternalData(
              { orthologueCount, numSpecies: speciesSet.size },
              'comparativeGenomics'
            );
            setLoading(false);
          }
        });

      return () => {
        console.log('ComparativeGenomics summary unmounted');
        isCurrent = false;
      };
    },
    [ensgId, setExternalData]
  );

  return (
    <SummaryItem
      definition={definition}
      request={{ loading, error, data }}
      renderSummary={data =>
        `${data.orthologueCount} orthologues in ${data.numSpecies} species`
      }
    />
  );
}

export default Summary;
