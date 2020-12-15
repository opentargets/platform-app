import React from 'react';
import * as d3 from 'd3';
import { makeStyles } from '@material-ui/core';
import { Link } from 'ot-ui';
import { colorRange } from '../constants';

const color = d3
  .scaleQuantize()
  .domain([0, 1])
  .range(colorRange);

const useStyles = makeStyles({
  colorSpan: {
    display: 'block',
    height: '20px',
    border: '1px solid #eeefef',
  },
});

function ScoreCell({ score, ensemblId, efoId }) {
  const classes = useStyles();
  return (
    <Link to={`/evidence/${ensemblId}/${efoId}`}>
      <span
        className={classes.colorSpan}
        title={score ? `Score: ${score.toFixed(2)}` : 'No data'}
        style={{ backgroundColor: color(score) }}
      />
    </Link>
  );
}

export default ScoreCell;
