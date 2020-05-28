import React, { useEffect, useState } from 'react';
import { Link } from 'ot-ui';

import Table from '../../../common/Table/Table';
import useBatchDownloader from '../../../../hooks/useBatchDownloader';
import { clinicalTrialsSearchUrl } from '../../../configuration';
import { label } from '../../../../utils/global';
import { sectionQuery } from '.';
import { generateComparatorFromAccessor } from '../../../../utils/comparators';

const columnPool = {
  clinicalTrialsColumns: {
    label: 'Clinical trials information',
    columns: [
      {
        id: 'phase',
        label: 'Phase',
        filterValue: d =>
          `${d.phase} phase ${
            { 0: 0, I: 1, II: 2, III: 3, IV: 4 }[
              d.phase.split('Phase ')[1] ?? 0
            ]
          }`,
      },
      {
        id: 'status',
        label: 'Status',
        renderCell: d => label(d.status),
      },
      {
        id: 'ctIds',
        label: 'Source',
        export: d => d.ctIds.join(','),
        filterValue: d => null,
        renderCell: d => {
          const ctSearchUrl = new URL(clinicalTrialsSearchUrl);
          ctSearchUrl.searchParams.append('results', d.ctIds.join(' OR '));

          return (
            <Link external to={ctSearchUrl.href}>
              Clinical trials
            </Link>
          );
        },
      },
    ],
  },
  diseaseColumns: {
    label: 'Disease information',
    columns: [
      {
        id: 'disease',
        label: 'Name',
        export: d => d.disease.id,
        filterValue: d => d.disease.name,
        renderCell: d => (
          <Link to={`/disease/${d.disease.id}`}>{label(d.disease.name)}</Link>
        ),
      },
    ],
  },
  drugColumns: {
    label: 'Drug information',
    columns: [
      {
        id: 'drug',
        label: 'Name',
        comparator: generateComparatorFromAccessor(d => d.drug.name),
        filterValue: d => d.drug.name,
        export: d => d.drug.id,
        renderCell: d => (
          <Link to={`/drug/${d.drug.id}`}>{label(d.drug.name)}</Link>
        ),
      },
      {
        id: 'drugType',
        label: 'Type',
        renderCell: d => label(d.drugType),
      },
      {
        id: 'mechanismOfAction',
        label: 'Mechanism of action',
      },
      {
        id: 'activity',
        label: 'Activity',
        renderCell: d => label(d.activity),
      },
    ],
  },
  targetColumns: {
    label: 'Target information',
    columns: [
      {
        id: 'target',
        label: 'Symbol',
        export: d => d.target.id,
        filterValue: d => d.target.approvedSymbol,
        renderCell: d => (
          <Link to={`/target/${d.target.id}`}>{d.target.approvedSymbol}</Link>
        ),
      },
      {
        id: 'target',
        label: 'Name',
        export: d => d.target.id,
        filterValue: d => d.target.approvedName,
        renderCell: d => label(d.target.approvedName),
      },
    ],
  },
};

const columnsToShow = [
  columnPool.diseaseColumns,
  columnPool.targetColumns,
  columnPool.clinicalTrialsColumns,
];

const stickyColumn = 'disease';

const columns = [];

columnsToShow.forEach(columnGroup => {
  columns.push(
    ...columnGroup.columns.map(column =>
      column.id === stickyColumn ? { ...column, sticky: true } : column
    )
  );
});

const headerGroups = [
  ...columnsToShow.map(group => ({
    colspan: group.columns.length,
    label: group.label,
  })),
];

const Section = ({ data, fetchMore, efoId }) => {
  const pageSize = 10;
  // eslint-disable-next-line no-unused-vars
  const [globalFilter, setGlobalFilter] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const getWholeDataset = useBatchDownloader(
    sectionQuery,
    { efoId },
    'disease.knownDrugs.rows',
    'disease.knownDrugs.count'
  );

  const onTableAction = params => {
    setGlobalFilter(params.globalFilter);
    setPageIndex(params.page);
  };

  useEffect(
    () => {
      fetchMore({
        variables: {
          index: pageIndex,
          size: pageSize,
          freeTextQuery: globalFilter,
        },
        updateQuery: (prev, { fetchMoreResult }) =>
          !fetchMoreResult ? prev : { ...prev, ...fetchMoreResult },
      });
    },
    [fetchMore, pageIndex, globalFilter]
  );

  return (
    <Table
      columns={columns}
      dataDownloader
      dataDownloaderRows={getWholeDataset}
      dataDownloaderFileStem={`${efoId}-known_drugs`}
      headerGroups={headerGroups}
      rows={data?.rows || []}
      rowCount={data?.count || 0}
      showGlobalFilter
      serverSide={true}
      onTableAction={onTableAction}
    />
  );
};

export default Section;