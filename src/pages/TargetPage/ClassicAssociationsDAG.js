import React, { Fragment, useState } from 'react';
import * as d3Base from 'd3';
import * as d3Dag from 'd3-dag';
import { withContentRect } from 'react-measure';
import { Typography } from '@material-ui/core';
import { colorRange } from '../../constants';
import Slider from './ClassicAssociationsSlider';

const d3 = Object.assign({}, d3Base, d3Dag);

function getParentIds(diseaseId, idToDisease, assocSet) {
  const disease = idToDisease[diseaseId];
  const parentIds = new Set();
  const queue = [...disease.parentIds];

  while (queue.length > 0) {
    const parentId = queue.shift();
    const parentNode = idToDisease[parentId];
    if (assocSet[parentId] || parentNode.parentIds.length === 0) {
      parentIds.add(parentId);
    } else {
      for (let i = 0; i < parentNode.parentIds.length; i++) {
        if (!queue.includes(parentNode.parentIds[i])) {
          queue.push(parentNode.parentIds[i]);
        }
      }
    }
  }

  return Array.from(parentIds);
}

function buildDagData(idToDisease, associations, assocSet) {
  const dag = [];
  const tas = new Set();
  associations.forEach(association => {
    const parentIds = getParentIds(
      association.disease.id,
      idToDisease,
      assocSet
    );

    parentIds.forEach(parentId => {
      const node = idToDisease[parentId];
      if (node.parentIds.length === 0 && !assocSet[parentId]) {
        tas.add(parentId);
      }
    });

    dag.push({
      id: association.disease.id,
      name: association.disease.name,
      score: association.score,
      parentIds,
    });
  });

  tas.forEach(id => {
    dag.push({
      id,
      name: idToDisease[id].name,
      parentIds: [],
    });
  });

  return dag;
}

const line = d3
  .line()
  .curve(d3.curveMonotoneX)
  .x(d => d.y)
  .y(d => d.x);

const layering = d3.layeringLongestPath();
const decross = d3.decrossTwoLayer();
const coord = d3.coordCenter();

const color = d3
  .scaleQuantize()
  .domain([0, 1])
  .range(colorRange);

const helperLayout = d3
  .sugiyama()
  .layering(layering)
  .decross(decross)
  .coord(coord);

function getMaxLayerCount(dag) {
  helperLayout(dag);

  const counts = {};
  let maxCount = Number.NEGATIVE_INFINITY;

  dag.descendants().forEach(node => {
    const { layer } = node;

    if (counts[layer]) {
      counts[layer]++;
    } else {
      counts[layer] = 1;
    }

    if (counts[layer] > maxCount) {
      maxCount = counts[layer];
    }
  });

  return maxCount;
}

function ClassicAssociationsDAG({
  ensemblId,
  symbol,
  efo,
  associations,
  measureRef,
  contentRect,
}) {
  const [minScore, setMinScore] = useState(0.1);
  const idToDisease = efo.reduce((acc, disease) => {
    acc[disease.id] = disease;
    return acc;
  }, {});

  const assocs = associations.filter(assoc => assoc.score >= minScore);

  const assocSet = assocs.reduce((acc, assoc) => {
    acc[assoc.disease.id] = assoc;
    return acc;
  }, {});

  const { width } = contentRect.bounds;

  const dagData = buildDagData(idToDisease, assocs, assocSet);
  const dag = dagData.length > 0 ? d3.dagStratify()(dagData) : null;
  const maxLayerCount = dagData.length > 0 ? getMaxLayerCount(dag) : 0;
  const height = maxLayerCount * 10;

  const layout = d3
    .sugiyama()
    .layering(layering)
    .decross(decross)
    .coord(coord)
    .size([height, width]);

  if (dagData.length > 0) layout(dag);

  return (
    <>
      <Slider value={minScore} onChange={(_, val) => setMinScore(val)} />
      <div ref={measureRef}>
        {width ? (
          assocs.length > 0 ? (
            <svg width={width} height={height}>
              <g>
                {dag.links().map(({ points, source, target }) => {
                  return (
                    <path
                      key={`${source.id}-${target.id}`}
                      d={line(points)}
                      fill="none"
                      strokeWidth="2"
                      stroke="#eeeeee"
                    />
                  );
                })}
              </g>
              <g>
                {dag.descendants().map(node => {
                  return (
                    <Fragment key={node.id}>
                      <text
                        x={node.y}
                        y={node.x}
                        dx="6"
                        fontSize="12"
                        dominantBaseline="middle"
                      >
                        {node.data.name}
                      </text>
                      {node.data.parentIds.length === 0 ? (
                        <rect
                          x={node.y - 4}
                          y={node.x - 4}
                          width="8"
                          height="8"
                          fill={
                            node.data.score ? color(node.data.score) : 'white'
                          }
                          stroke="#e0e0e0"
                        />
                      ) : (
                        <circle
                          cx={node.y}
                          cy={node.x}
                          r={4}
                          fill={color(node.data.score)}
                          stroke="#e0e0e0"
                        />
                      )}
                    </Fragment>
                  );
                })}
              </g>
            </svg>
          ) : (
            <Typography align="center">
              No associations with score greater than or equal to {minScore}
            </Typography>
          )
        ) : null}
      </div>
    </>
  );
}

export default withContentRect('bounds')(ClassicAssociationsDAG);
