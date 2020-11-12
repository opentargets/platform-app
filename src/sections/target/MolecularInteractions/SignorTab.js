import React, { Fragment, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { loader } from 'graphql.macro';
import client from '../../../client';

import DataTable from '../../../components/Table/DataTable';
import { MethodIconText, MethodIconArrow } from './custom/MethodIcons';

import Grid from '@material-ui/core/Grid';
import { Link } from 'ot-ui';

const INTERACTIONS_QUERY = loader('./sectionQuery.gql');
const getData = (ensgId, sourceDatabase, index, size) => {
  return client.query({
    query: INTERACTIONS_QUERY,
    variables: {
      ensgId,
      sourceDatabase,
      index,
      size,
    },
  });
};

const onLinkClick = function(e) {
  // handler to stop propagation of clicks on links in table rows
  // to avoid selection of a different row
  e.stopPropagation();
};

const columns = {
  // interactions table columns
  interactions: [
    {
      id: 'targetA',
      label: (
        <>
          Interactor A
          <br />
          <Typography variant="caption">
            Species
            <br />
            Ald ID
          </Typography>
        </>
      ),
      renderCell: row => (
        <>
          {row.targetA ? row.targetA.approvedSymbol : row.intA}
          <br />
          <Typography variant="caption">
            Species: {row.speciesA.mnemonic}
            <br />
            Alt ID:{' '}
            <Link
              to={`http://uniprot.org/uniprot/${row.intA}`}
              onClick={onLinkClick}
              external
            >
              {row.intA}
            </Link>
          </Typography>
        </>
      ),
    },
    {
      id: 'targetB',
      label: (
        <>
          Interactor B
          <br />
          <Typography variant="caption">
            Species
            <br />
            Ald ID
          </Typography>
        </>
      ),
      renderCell: row => (
        <>
          {row.targetB ? row.targetB.approvedSymbol : row.intB}
          <br />
          <Typography variant="caption">
            Species: {row.speciesB.mnemonic}
            <br />
            Alt ID:{' '}
            <Link
              to={`http://uniprot.org/uniprot/${row.intB}`}
              onClick={onLinkClick}
              external
            >
              {row.intB}
            </Link>
          </Typography>
        </>
      ),
    },
    {
      id: 'role',
      label: (
        <>
          Biological
          <br />
          role
        </>
      ),
      renderCell: row => (
        <>
          <MethodIconText
            tooltip={row.intABiologicalRole}
            enabled={row.intABiologicalRole}
          >
            A
          </MethodIconText>
          <MethodIconText
            tooltip={row.intBBiologicalRole}
            enabled={row.intBBiologicalRole}
          >
            B
          </MethodIconText>
        </>
      ),
    },
    {
      id: 'evidences',
      label: (
        <>
          Interaction
          <br />
          evidence
        </>
      ),
      renderCell: row => row.count,
    },
  ],

  // evidence table
  evidence: [
    {
      id: 'interactionIdentifier',
      label: 'Identifier',
    },
    {
      id: 'interaction',
      label: (
        <>
          Interaction
          <br />
          <Typography variant="caption">Host organism</Typography>
        </>
      ),
      renderCell: row => (
        <>
          {row.interactionTypeShortName}
          <br />
          <Typography variant="caption">
            {row.hostOrganismScientificName}
          </Typography>
        </>
      ),
    },
    {
      id: 'methods',
      label: 'Detection methods',
      renderCell: row => (
        <>
          <MethodIconText
            tooltip={row.participantDetectionMethodA.map(m => m.shortName)}
            enabled={
              row.participantDetectionMethodA &&
              row.participantDetectionMethodA.length > 0 &&
              row.participantDetectionMethodA[0].shortName
            }
          >
            A
          </MethodIconText>
          <MethodIconArrow
            tooltip={row.interactionDetectionMethodShortName}
            enabled={row.interactionDetectionMethodShortName}
          />
          <MethodIconText
            tooltip={row.participantDetectionMethodB[0].shortName}
            enabled={
              row.participantDetectionMethodB &&
              row.participantDetectionMethodB.length > 0 &&
              row.participantDetectionMethodB[0].shortName
            }
          >
            B
          </MethodIconText>
        </>
      ),
    },
    {
      id: 'pubmedId',
      label: 'Publication',
      renderCell: d =>
        d.pubmedId && d.pubmedId.indexOf('unassigned') === -1 ? (
          <Link external to={`http://europepmc.org/abstract/MED/${d.pubmedId}`}>
            {d.pubmedId}
          </Link>
        ) : (
          d.pubmedId
        ),
    },
  ],
};

const id = 'signor';
const index = 0;
const size = 5000;

function SignorTab({ ensgId, symbol }) {
  const [data, setData] = useState([]);
  const [evidence, setEvidence] = useState([]);

  // load tab data when new tab selected (also on first load)
  useEffect(
    () => {
      getData(ensgId, id, index, size).then(res => {
        if (res.data.target.interactions) {
          setData(res.data.target.interactions.rows);
          setEvidence(res.data.target.interactions.rows[0].evidences);
        }
      });
    },
    [ensgId]
  );

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={5}>
        {/* table 1: interactions */}
        <DataTable
          showGlobalFilter
          columns={columns.interactions}
          rows={data}
          dataDownloader
          dataDownloaderFileStem={`${symbol}-molecular-interactions-signor`}
          hover
          selected
          onRowClick={(r, i) => {
            setEvidence(r.evidences);
          }}
          rowIsSelectable
        />
      </Grid>

      {/* table 2: evidence */}
      <Grid item xs={12} md={7}>
        <DataTable
          showGlobalFilter
          columns={columns.evidence}
          rows={evidence}
          dataDownloader
          dataDownloaderFileStem={`${symbol}-molecular-interactions-signor`}
        />
      </Grid>
    </Grid>
  );
}

export default SignorTab;
