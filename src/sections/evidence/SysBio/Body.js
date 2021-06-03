import React from 'react';
import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';

import { DataTable } from '../../../components/Table';
import Description from './Description';
import { defaultRowsPerPageOptions, naLabel } from '../../../constants';
import { epmcUrl } from '../../../utils/urls';
import Link from '../../../components/Link';
import { PublicationsDrawer } from '../../../components/PublicationsDrawer';
import SectionItem from '../../../components/Section/SectionItem';
import Summary from './Summary';
import Tooltip from '../../../components/Tooltip';
import usePlatformApi from '../../../hooks/usePlatformApi';

const SYSBIO_QUERY = loader('./sectionQuery.gql');

const columns = [
  {
    id: 'disease',
    label: 'Disease/phenotype',
    renderCell: ({ disease }) => (
      <Link to={`/disease/${disease.id}`}>{disease.name}</Link>
    ),
    filterValue: ({ disease }) => disease.name,
  },
  {
    id: 'pathwayName',
    label: 'Gene set',
    renderCell: ({ pathways, studyOverview }) =>
      pathways?.length >= 1 ? (
        studyOverview ? (
          <Tooltip title={studyOverview} showHelpIcon>
            {pathways[0].name}
          </Tooltip>
        ) : (
          pathways[0].name
        )
      ) : (
        naLabel
      ),
  },
  {
    id: 'literature',
    renderCell: ({ literature }) => {
      const literatureList =
        literature?.reduce((acc, id) => {
          if (id !== 'NA') {
            acc.push({
              name: id,
              url: epmcUrl(id),
              group: 'literature',
            });
          }
          return acc;
        }, []) || [];
      return <PublicationsDrawer entries={literatureList} />;
    },
  },
];

function Body({ definition, id: { ensgId, efoId }, label: { symbol, name } }) {
  const {
    data: {
      sysBio: { count: size },
    },
  } = usePlatformApi(Summary.fragments.SysBioSummaryFragment);

  const request = useQuery(SYSBIO_QUERY, {
    variables: { ensemblId: ensgId, efoId, size },
  });

  return (
    <SectionItem
      definition={definition}
      chipText="Pathways & sys bio"
      request={request}
      renderDescription={() => <Description symbol={symbol} name={name} />}
      renderBody={data => (
        <DataTable
          columns={columns}
          dataDownloader
          dataDownloaderFileStem={`otgenetics-${ensgId}-${efoId}`}
          rows={data.disease.evidences.rows}
          pageSize={10}
          rowsPerPageOptions={defaultRowsPerPageOptions}
          showGlobalFilter
        />
      )}
    />
  );
}

export default Body;
