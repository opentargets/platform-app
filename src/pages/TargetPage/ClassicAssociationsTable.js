import React, { useState } from 'react';
import gql from 'graphql-tag';
import * as d3 from 'd3';
import { useQuery } from '@apollo/client';
import { makeStyles } from '@material-ui/core';
import { Table } from '../../components/Table';

import { client3 } from '../../client';

const TARGET_ASSOCIATIONS_QUERY = gql`
  query TargetAssociationsQuery($ensemblId: String!, $page: Pagination!) {
    target(ensemblId: $ensemblId) {
      associatedDiseases(page: $page) {
        score
        idPerDT
        scorePerDT
        disease {
          id
          name
        }
      }
    }
  }
`;

const dataTypes = [
  { id: 'genetic_association', label: 'Genetic associations' },
  { id: 'somatic_mutation', label: 'Somatic mutations' },
  { id: 'known_drug', label: 'Drugs' },
  { id: 'affected_pathway', label: 'Pathways & systems biology' },
  { id: 'rna_expression', label: 'RNA expression' },
  { id: 'literature', label: 'Text mining' },
  { id: 'animal_model', label: 'Animal models' },
];

const color = d3
  .scaleQuantize()
  .domain([0, 1])
  .range([
    '#e8edf1',
    '#d2dce4',
    '#bbcbd6',
    '#a5b9c9',
    '#8fa8bc',
    '#7897ae',
    '#6285a1',
    '#4b7493',
    '#356386',
    '#1f5279',
  ]);

const useStyles = makeStyles({
  table: {
    width: 'unset',
    tableLayout: 'fixed',
  },
  cell: {
    width: '50px',
    textAlign: 'center',
    border: '1px solid #ccc',
    padding: 0,
    '&:last-child': {
      paddingRight: 0,
    },
  },
  nameCell: {
    border: '1px solid #ccc',
    width: '220px',
    padding: '0 0.5rem 0 0',
    '&:first-child': {
      paddingLeft: 0,
    },
  },
  name: {
    width: '220px',
    textAlign: 'end',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  scoreCell: {
    height: '19px',
    width: '100%',
  },
});

function getColumns(classes) {
  return [
    {
      id: 'name',
      label: 'Name',
      labelStyle: {
        height: '140px',
        textAlign: 'end',
        verticalAlign: 'bottom',
      },
      cellClasses: classes.nameCell,
      renderCell: row => {
        return (
          <div title={row.name} className={classes.name}>
            {row.name}
          </div>
        );
      },
    },
    {
      id: 'overall',
      label: 'Overall association score',
      labelStyle: {
        height: '140px',
        padding: 0,
      },
      slanted: true,
      cellClasses: classes.cell,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={row.overall.toFixed(2)}
            style={{
              backgroundColor: color(row.overall),
            }}
          />
        );
      },
    },
    {
      id: 'genetic_association',
      label: 'Genetic associations',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={
              row.genetic_association
                ? row.genetic_association.toFixed(2)
                : 'No data'
            }
            style={{
              backgroundColor: color(row.genetic_association),
            }}
          />
        );
      },
    },
    {
      id: 'somatic_mutation',
      label: 'Somatic mutations',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={
              row.somatic_mutation ? row.somatic_mutation.toFixed(2) : 'No data'
            }
            style={{
              backgroundColor: color(row.somatic_mutation),
            }}
          />
        );
      },
    },
    {
      id: 'known_drug',
      label: 'Drugs',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={row.known_drug ? row.known_drug.toFixed(2) : 'No data'}
            style={{
              backgroundColor: color(row.known_drug),
            }}
          />
        );
      },
    },
    {
      id: 'affected_pathway',
      label: 'Pathways & systems biology',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={
              row.affected_pathway ? row.affected_pathway.toFixed(2) : 'No data'
            }
            style={{
              backgroundColor: color(row.affected_pathway),
            }}
          />
        );
      },
    },
    {
      id: 'rna_expression',
      label: 'RNA expression',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={
              row.rna_expression ? row.rna_expression.toFixed(2) : 'No data'
            }
            style={{
              backgroundColor: color(row.rna_expression),
            }}
          />
        );
      },
    },
    {
      id: 'literature',
      label: 'Text mining',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={row.literature ? row.literature.toFixed(2) : 'No data'}
            style={{
              backgroundColor: color(row.literature),
            }}
          />
        );
      },
    },
    {
      id: 'animal_model',
      label: 'Animal models',
      labelStyle: { height: '140px', padding: 0 },
      cellClasses: classes.cell,
      slanted: true,
      renderCell: row => {
        return (
          <div
            className={classes.scoreCell}
            title={row.animal_model ? row.animal_model.toFixed(2) : 'No data'}
            style={{
              backgroundColor: color(row.animal_model),
            }}
          />
        );
      },
    },
  ];
}

function getRows(data) {
  return data.map(d => {
    const row = {
      name: d.disease.name,
      overall: d.score,
    };
    dataTypes.forEach(dataType => {
      const index = d.idPerDT.indexOf(dataType.id);

      if (index !== -1) {
        row[dataType.id] = d.scorePerDT[index];
      }
    });
    return row;
  });
}

const ClassicAssociationsTable = ({ ensgId }) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const { loading, error, data } = useQuery(TARGET_ASSOCIATIONS_QUERY, {
    variables: {
      ensemblId: ensgId,
      page: { index: page, size: pageSize },
    },
    client: client3,
  });

  function handlePageChange(page) {
    setPage(page);
  }

  function handleRowsPerPageChange(pageSize) {
    setPageSize(pageSize);
  }

  if (error) return null;

  const columns = getColumns(classes);
  const rows = getRows(data?.target.associatedDiseases ?? []);

  return (
    <Table
      loading={loading}
      classes={{ table: classes.table }}
      page={page}
      columns={columns}
      rows={rows}
      pageSize={pageSize}
      rowCount={600}
      rowsPerPageOptions={[10, 50, 200, 500]}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
    />
  );
};

export default ClassicAssociationsTable;
