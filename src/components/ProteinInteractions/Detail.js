import React from 'react';
import { withContentRect } from 'react-measure';
import classNames from 'classnames';
import * as d3 from 'd3';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';

import { Button, Link, OtTableRF, PALETTE } from 'ot-ui';

const query = gql`
  query ProteinInteractionsQuery($ensgId: String!) {
    target(ensgId: $ensgId) {
      details {
        proteinInteractions {
          nodes {
            uniprotId
            ensgId
            symbol
          }
          edges {
            source
            target
            isDirected
            isStimulation
            isInhibition
            pmIds
            sources
            pathwaysSources
            enzymeSubstrateSources
            ppiSources
          }
        }
      }
    }
  }
`;

const sourceTypeColors = {
  enzymeSubstrate: PALETTE.red, //'#fcc',
  pathways: PALETTE.green, //'#cfc',
  ppi: PALETTE.purple, //'#ccf',
};

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit * 0.5,
    marginLeft: theme.spacing.unit * 2,
  },
  chip: {
    margin: theme.spacing.unit * 0.5,
  },
  chipSource: {
    margin: '1px',
    height: '24px',
    color: 'white',
  },
  chipSourcePathways: {
    backgroundColor: sourceTypeColors.pathways,
    // border: `1px solid black`,
    // border: `1px solid ${sourceTypeColors.pathways}`,
  },
  chipSourcePPI: {
    backgroundColor: sourceTypeColors.ppi,
    // border: `1px solid black`,
    // border: `1px solid ${sourceTypeColors.ppi}`,
  },
  chipSourceEnzymeSubstrate: {
    backgroundColor: sourceTypeColors.enzymeSubstrate,
    // border: `1px solid black`,
    // border: `1px solid ${sourceTypeColors.enzymeSubstrate}`,
  },
  checked: {},
  checkboxPathways: {
    '&$checked': {
      color: sourceTypeColors.pathways,
    },
  },
  checkboxPPI: {
    '&$checked': {
      color: sourceTypeColors.ppi,
    },
  },
  checkboxEnzymeSubstrate: {
    '&$checked': {
      color: sourceTypeColors.enzymeSubstrate,
    },
  },
});

class ProteinInteractionsDetail extends React.Component {
  state = {
    interactionTypes: {
      enzymeSubstrate: true,
      pathways: true,
      ppi: true,
    },
    selectedUniprotIds: [],
  };
  static getDerivedStateFromProps(props) {
    const { width = 600 } = props.contentRect.bounds;
    return { width };
  }
  handleInteractionTypeChange = interactionType => event => {
    const { interactionTypes } = this.state;
    this.setState({
      interactionTypes: {
        ...interactionTypes,
        [interactionType]: event.target.checked,
      },
    });
  };
  handleProteinClick = uniprotId => {
    const { selectedUniprotIds } = this.state;
    if (selectedUniprotIds.indexOf(uniprotId) >= 0) {
      this.setState({
        selectedUniprotIds: selectedUniprotIds.filter(d => d !== uniprotId),
      });
    } else {
      this.setState({ selectedUniprotIds: [...selectedUniprotIds, uniprotId] });
    }
  };
  componentDidMount() {
    const { uniprotId } = this.props;
    this.setState({ selectedUniprotIds: [uniprotId] });
  }
  render() {
    const { classes, ensgId, symbol, measureRef } = this.props;
    const { width, interactionTypes, selectedUniprotIds } = this.state;
    const height = Math.min(width, 700);
    return (
      <Query query={query} variables={{ ensgId }} fetchPolicy="no-cache">
        {({ loading, error, data }) => {
          if (loading || error) {
            return null;
          }

          if (!data.target) {
            return null;
          }

          const {
            nodes: nodesRaw,
            edges,
          } = data.target.details.proteinInteractions;
          const edgesWithFilterProperties = edges
            .map(e => ({
              ...e,
              isFilteredSourceType:
                (interactionTypes.ppi && e.ppiSources.length > 0) ||
                (interactionTypes.pathways && e.pathwaysSources.length > 0) ||
                (interactionTypes.enzymeSubstrate &&
                  e.enzymeSubstrateSources.length > 0),
            }))
            .map(e => ({
              ...e,
              isFilteredWithinSelectedUniprotIds:
                selectedUniprotIds.length > 1
                  ? selectedUniprotIds.indexOf(e.source) >= 0 &&
                    selectedUniprotIds.indexOf(e.target) >= 0
                  : false,
              isFilteredWithoutSelectedUniprotIds:
                selectedUniprotIds.length > 0
                  ? (selectedUniprotIds.indexOf(e.source) >= 0 &&
                      selectedUniprotIds.indexOf(e.target) < 0) ||
                    (selectedUniprotIds.indexOf(e.target) >= 0 &&
                      selectedUniprotIds.indexOf(e.source) < 0)
                  : false,
            }));
          const edgesFiltered = edgesWithFilterProperties.filter(
            e => e.isFilteredSourceType
          );
          const edgesFilteredWithinSelectedUniprotIds = edgesFiltered.filter(
            e => e.isFilteredWithinSelectedUniprotIds
          );
          const edgesFilteredWithoutSelectedUniprotIds = edgesFiltered.filter(
            e => e.isFilteredWithoutSelectedUniprotIds
          );
          const edgesFilteredEitherWithinOrWithoutSelectedUniprotIds = edgesFiltered.filter(
            e =>
              e.isFilteredWithinSelectedUniprotIds ||
              e.isFilteredWithoutSelectedUniprotIds
          );
          const edgesSelected =
            selectedUniprotIds.length > 0
              ? selectedUniprotIds.length > 1
                ? edgesWithFilterProperties.filter(
                    e => e.isFilteredWithinSelectedUniprotIds
                  )
                : edgesWithFilterProperties.filter(
                    e =>
                      e.isFilteredWithinSelectedUniprotIds ||
                      e.isFilteredWithoutSelectedUniprotIds
                  )
              : edgesWithFilterProperties;
          const nodes = nodesRaw.map(n => ({
            ...n,
            neighbourCount: edgesFiltered.filter(
              e => e.source === n.uniprotId || e.target === n.uniprotId
            ).length,
            neighbourCountWithin: edgesFilteredWithinSelectedUniprotIds.filter(
              e => e.source === n.uniprotId || e.target === n.uniprotId
            ).length,
            neighbourCountWithinOrWithout: edgesFilteredEitherWithinOrWithoutSelectedUniprotIds.filter(
              e => e.source === n.uniprotId || e.target === n.uniprotId
            ).length,
            isSelected: selectedUniprotIds.indexOf(n.uniprotId) >= 0,
            isNeighbourOfSelected:
              selectedUniprotIds.indexOf(n.uniprotId) < 0 &&
              edgesFilteredWithoutSelectedUniprotIds.filter(
                e => e.source === n.uniprotId || e.target === n.uniprotId
              ).length,
          }));
          const nodeCount = nodes.length;
          const maxNeighbourCount = d3.max(nodes, n => n.neighbourCount);
          const legendInterval = maxNeighbourCount / 5;
          const legendData = [
            0,
            legendInterval,
            legendInterval * 2,
            legendInterval * 3,
            legendInterval * 4,
            legendInterval * 5,
          ];

          // helpers
          const padding = 100;
          const radius = height / 2 - padding;
          const diameter = 2 * radius;
          const textOffset = 10;
          const textRadius = radius + textOffset;
          const circleRadius = 4;
          const colour = d3
            .scaleLog()
            .domain(d3.extent(nodes, n => n.neighbourCount + 1))
            .range(['#fff', '#3489ca']);

          // order alphabetically
          const uniprotIdToIndex = new Map(
            nodes
              .sort((a, b) => d3.ascending(a.symbol, b.symbol))
              .map((d, i) => [d.uniprotId, i])
          );
          const nodeToAngleRad = n =>
            (2 * Math.PI * uniprotIdToIndex.get(n)) / nodeCount;
          const nodeToAngleDeg = n =>
            (360 * uniprotIdToIndex.get(n)) / nodeCount;
          const nodeToColour = n => colour(n.neighbourCount + 1);
          const isInRightSemiCircle = n =>
            uniprotIdToIndex.get(n) / nodeCount < 0.5;

          return (
            <Grid container>
              <Grid item sm={12} md={6}>
                <div>
                  <Typography>Filter by interaction type</Typography>

                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            classes={{
                              root: classes.checkboxEnzymeSubstrate,
                              checked: classes.checked,
                            }}
                            checked={interactionTypes.enzymeSubstrate}
                            onChange={this.handleInteractionTypeChange(
                              'enzymeSubstrate'
                            )}
                            value="enzymeSubstrate"
                          />
                        }
                        label={`Enzyme-substrate (${
                          edgesSelected.filter(
                            e => e.enzymeSubstrateSources.length > 0
                          ).length
                        })`}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            classes={{
                              root: classes.checkboxPathways,
                              checked: classes.checked,
                            }}
                            checked={interactionTypes.pathways}
                            onChange={this.handleInteractionTypeChange(
                              'pathways'
                            )}
                            value="pathways"
                          />
                        }
                        label={`Pathways (${
                          edgesSelected.filter(
                            e => e.pathwaysSources.length > 0
                          ).length
                        })`}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            classes={{
                              root: classes.checkboxPPI,
                              checked: classes.checked,
                            }}
                            checked={interactionTypes.ppi}
                            onChange={this.handleInteractionTypeChange('ppi')}
                            value="ppi"
                          />
                        }
                        label={`PPI (${
                          edgesSelected.filter(e => e.ppiSources.length > 0)
                            .length
                        })`}
                      />
                    </FormGroup>
                  </FormControl>
                </div>
                <br />
                <Typography>Selection</Typography>

                {selectedUniprotIds.length > 0 ? (
                  <React.Fragment>
                    {selectedUniprotIds.map(uniprotId => (
                      <Chip
                        key={uniprotId}
                        className={classes.chip}
                        color="primary"
                        label={
                          nodes.find(n => n.uniprotId === uniprotId).symbol
                        }
                        onDelete={() => this.handleProteinClick(uniprotId)}
                      />
                    ))}
                    {selectedUniprotIds.length > 1 ? (
                      <Button color="primary" size="small" disableRipple>
                        Analyse with batch search
                      </Button>
                    ) : null}
                  </React.Fragment>
                ) : (
                  <Typography align="center" style={{ padding: '4px' }}>
                    <i>
                      No selection. Click on proteins on the chart to make a
                      selection.
                    </i>
                  </Typography>
                )}

                <br />
                <br />
                <Typography>Interaction details</Typography>
                <OtTableRF
                  columns={[
                    {
                      id: 'source',
                      label: 'Source',
                      renderCell: d => {
                        const node = nodes.find(n => n.uniprotId === d.source);
                        const { ensgId, symbol } = node;
                        return <Link to={`target/${ensgId}`}>{symbol}</Link>;
                      },
                    },
                    {
                      id: 'target',
                      label: 'Target',
                      renderCell: d => {
                        const node = nodes.find(n => n.uniprotId === d.target);
                        const { ensgId, symbol } = node;
                        return <Link to={`target/${ensgId}`}>{symbol}</Link>;
                      },
                    },
                    {
                      id: 'sources',
                      label: 'Sources',
                      renderCell: d => (
                        <React.Fragment>
                          {interactionTypes.enzymeSubstrate
                            ? d.enzymeSubstrateSources.map(s => (
                                <Chip
                                  className={classNames(
                                    classes.chipSource,
                                    classes.chipSourceEnzymeSubstrate
                                  )}
                                  key={s}
                                  label={s}
                                  color={sourceTypeColors.enzymeSubstrate}
                                />
                              ))
                            : null}
                          {interactionTypes.pathways
                            ? d.pathwaysSources.map(s => (
                                <Chip
                                  className={classNames(
                                    classes.chipSource,
                                    classes.chipSourcePathways
                                  )}
                                  key={s}
                                  label={s}
                                  color={sourceTypeColors.pathways}
                                />
                              ))
                            : null}
                          {interactionTypes.ppi
                            ? d.ppiSources.map(s => (
                                <Chip
                                  className={classNames(
                                    classes.chipSource,
                                    classes.chipSourcePPI
                                  )}
                                  key={s}
                                  label={s}
                                  color={sourceTypeColors.ppi}
                                />
                              ))
                            : null}
                        </React.Fragment>
                      ),
                    },
                    {
                      id: 'pmIds',
                      label: 'Reference',
                      renderCell: d =>
                        d.pmIds.length > 0 ? (
                          <Link
                            external
                            to={`https://europepmc.org/search?query=${d.pmIds
                              .map(r => `EXT_ID:${r}`)
                              .join(' OR ')}`}
                          >
                            {d.pmIds.length} publication
                            {d.pmIds.length > 1 ? 's' : null}
                          </Link>
                        ) : null,
                    },
                  ]}
                  data={
                    selectedUniprotIds.length > 0
                      ? selectedUniprotIds.length > 1
                        ? edgesFilteredWithinSelectedUniprotIds
                        : edgesFilteredWithoutSelectedUniprotIds
                      : edgesFiltered
                  }
                />
              </Grid>
              <Grid item sm={12} md={6}>
                <div ref={measureRef}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={width}
                    height={height}
                  >
                    <g
                      transform={`translate(${width -
                        20 * (legendData.length + 3)},${20})`}
                    >
                      <text
                        x={-10}
                        y={10}
                        fill="#bbb"
                        textAnchor="end"
                        alignmentBaseline="central"
                      >
                        {0}
                      </text>
                      {legendData.map((d, i) => (
                        <rect
                          x={i * 20}
                          y={0}
                          width={20}
                          height={20}
                          fill={colour(d + 1)}
                          stroke="#bbb"
                        />
                      ))}
                      <text
                        x={legendData.length * 20 + 10}
                        y={10}
                        fill="#bbb"
                        textAnchor="start"
                        alignmentBaseline="central"
                      >
                        {maxNeighbourCount}
                      </text>
                    </g>
                    <g transform={`translate(${20},${20})`}>
                      <circle
                        cx="10"
                        cy="10"
                        r={circleRadius}
                        stroke="#000"
                        strokeWidth="2"
                        fill="none"
                      />
                      <text
                        x="30"
                        y="10"
                        fill="#000"
                        fontSize="12px"
                        fontWeight="bold"
                        textAnchor="start"
                        alignmentBaseline="central"
                      >
                        Selection
                      </text>
                      <circle
                        cx="10"
                        cy="30"
                        r={circleRadius}
                        stroke="#bbb"
                        fill="none"
                      />
                      <text
                        x="30"
                        y="30"
                        fill="#777"
                        fontSize="10px"
                        textAnchor="start"
                        alignmentBaseline="central"
                      >
                        Neighbour of selection
                      </text>
                      <circle
                        cx="10"
                        cy="50"
                        r={circleRadius}
                        stroke="#bbb"
                        fill="none"
                      />
                      <text
                        x="30"
                        y="50"
                        fill="#ddd"
                        fontSize="10px"
                        textAnchor="start"
                        alignmentBaseline="central"
                      >
                        Not a neighbour of selection
                      </text>
                    </g>
                    {selectedUniprotIds.length > 0 ? (
                      <g
                        fill="none"
                        stroke="#999"
                        strokeOpacity={0.6}
                        transform={`translate(${width / 2},${height / 2})`}
                      >
                        {(selectedUniprotIds.length === 1
                          ? edgesFilteredWithoutSelectedUniprotIds
                          : edgesFilteredWithinSelectedUniprotIds
                        ).map(e => {
                          let fromAngle = nodeToAngleRad(e.source) + 0.001;
                          let toAngle = nodeToAngleRad(e.target) + 0.001;
                          let fromX =
                            ((diameter - circleRadius) / 2) *
                            Math.sin(fromAngle);
                          let fromY =
                            (-(diameter - circleRadius) / 2) *
                            Math.cos(fromAngle);
                          let toX =
                            ((diameter - circleRadius) / 2) * Math.sin(toAngle);
                          let toY =
                            (-(diameter - circleRadius) / 2) *
                            Math.cos(toAngle);
                          const d = `M${fromX},${fromY} Q0,0 ${toX},${toY}`;
                          return <path d={d} />;
                        })}
                      </g>
                    ) : (
                      <g
                        fill="none"
                        stroke="#999"
                        strokeOpacity={0.6}
                        transform={`translate(${width / 2},${height / 2})`}
                      >
                        {edgesFiltered.map(e => {
                          let fromAngle = nodeToAngleRad(e.source) + 0.001;
                          let toAngle = nodeToAngleRad(e.target) + 0.001;
                          let fromX =
                            ((diameter - circleRadius) / 2) *
                            Math.sin(fromAngle);
                          let fromY =
                            (-(diameter - circleRadius) / 2) *
                            Math.cos(fromAngle);
                          let toX =
                            ((diameter - circleRadius) / 2) * Math.sin(toAngle);
                          let toY =
                            (-(diameter - circleRadius) / 2) *
                            Math.cos(toAngle);
                          const d = `M${fromX},${fromY} Q0,0 ${toX},${toY}`;
                          return <path d={d} />;
                        })}
                      </g>
                    )}
                    <g
                      style={{ font: '10px sans-serif' }}
                      transform={`translate(${width / 2},${height / 2})`}
                    >
                      {nodes.map(n => {
                        const { isSelected, isNeighbourOfSelected } = n;
                        const angleRad = nodeToAngleRad(n.uniprotId);
                        const angleDeg = nodeToAngleDeg(n.uniprotId);
                        const isRightHalf = isInRightSemiCircle(n.uniprotId);
                        return (
                          <g
                            key={n.uniprotId}
                            transform={`translate(${textRadius *
                              Math.sin(angleRad)},${-textRadius *
                              Math.cos(angleRad)})`}
                            onClick={() => this.handleProteinClick(n.uniprotId)}
                          >
                            <circle
                              cx="0"
                              cy="0"
                              r={circleRadius}
                              fill={nodeToColour(n)}
                              stroke={isSelected ? '#000' : '#bbb'}
                              strokeWidth={isSelected ? 2 : 1}
                              style={{ cursor: 'pointer' }}
                            />
                            <text
                              x="0"
                              y="0"
                              style={{ cursor: 'pointer' }}
                              fill={
                                selectedUniprotIds.length > 0
                                  ? isSelected
                                    ? '#000'
                                    : isNeighbourOfSelected
                                    ? '#777'
                                    : '#ddd'
                                  : '#777'
                              }
                              fontSize={isSelected ? '12px' : null}
                              fontWeight={isSelected ? 'bold' : null}
                              textAnchor={isRightHalf ? 'start' : 'end'}
                              alignmentBaseline="central"
                              transform={`rotate(${(isRightHalf ? 270 : 90) +
                                angleDeg}) translate(${
                                isRightHalf ? textOffset : -textOffset
                              }, 0)`}
                            >
                              {n.symbol} (
                              {selectedUniprotIds.length > 0
                                ? selectedUniprotIds.length === 1
                                  ? n.neighbourCountWithinOrWithout
                                  : n.neighbourCountWithin
                                : n.neighbourCount}
                              )
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  </svg>
                </div>
              </Grid>
            </Grid>
          );
        }}
      </Query>
    );
  }
}

export default withContentRect('bounds')(
  withStyles(styles)(ProteinInteractionsDetail)
);
