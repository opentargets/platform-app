import React, { Component } from 'react';
import * as d3 from 'd3';
import withTheme from '@material-ui/core/styles/withTheme';

const width = 900;
const boxHeight = 20;
const boxPadding = boxHeight / 4;
const margin = { top: 40, right: 20, bottom: 20, left: 220 };
const outlierRadius = 2;

class GtexVariability extends Component {
  boxPlotRef = React.createRef();
  xAxisRef = React.createRef();
  yAxisRef = React.createRef();
  xAxis = d3.axisTop();
  yAxis = d3.axisLeft();
  x = d3.scaleLinear();
  y = d3.scalePoint().padding(0.5);
  colour = d3.scaleOrdinal();

  render() {
    const { theme, data } = this.props;

    const height = data.length * boxHeight + margin.top + margin.bottom;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" height={height} width={width}>
        <text
          x={margin.left}
          y="15"
          fill={theme.palette.grey[700]}
          fontSize="14"
        >
          Normalised expression (RPKM)
        </text>
        <g
          className="boxplot"
          ref={this.boxPlotRef}
          transform={`translate(${margin.left}, ${margin.top})`}
        />
        <g
          ref={this.xAxisRef}
          transform={`translate(${margin.left}, ${margin.top})`}
        />
        <g
          ref={this.yAxisRef}
          transform={`translate(${margin.left}, ${margin.top})`}
        />
      </svg>
    );
  }

  componentDidMount() {
    this._render();
  }

  componentDidUpdate() {
    this._render();
  }

  _render() {
    const { theme } = this.props;
    const { x, y, colour } = this;
    const data = this.props.data.slice().sort((a, b) => b.median - a.median);

    const height = data.length * boxHeight + margin.top + margin.bottom;
    const rectHeight = boxHeight - 2 * boxPadding;
    const xMax = d3.max(data, d => {
      return d3.max(d.outliers);
    });

    x.domain([0, xMax]).range([0, width - margin.left - margin.right]);
    y.domain(data.map(d => d.tissueSiteDetailId.replace(/_/g, ' '))).range([
      0,
      height - margin.top - margin.bottom,
    ]);

    colour
      .domain(data.map(d => d.tissueSiteDetailId))
      .range(d3.schemeCategory10);

    const boxPlot = d3.select(this.boxPlotRef.current);

    const boxContainer = boxPlot
      .selectAll('g')
      .data(data)
      .join('g');

    boxContainer
      .append('line')
      .attr('x1', d => x(d.lowerLimit))
      .attr('x2', d => x(d.upperLimit))
      .attr('y1', d => y(d.tissueSiteDetailId.replace(/_/g, ' ')))
      .attr('y2', d => y(d.tissueSiteDetailId.replace(/_/g, ' ')))
      .attr('stroke', theme.palette.grey[700]);

    boxContainer
      .append('rect')
      .attr('x', d => x(d.q1))
      .attr(
        'y',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) - rectHeight / 2
      )
      .attr('width', d => x(d.q3) - x(d.q1))
      .attr('height', rectHeight)
      .attr('fill', d => colour(d.tissueSiteDetailId));

    boxContainer
      .append('line')
      .attr('x1', d => x(d.median))
      .attr('x2', d => x(d.median))
      .attr(
        'y1',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) - rectHeight / 2
      )
      .attr(
        'y2',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) + rectHeight / 2
      )
      .attr('stroke', theme.palette.grey[700])
      .attr('stroke-width', 2);

    boxContainer
      .append('line')
      .attr('x1', d => x(d.lowerLimit))
      .attr('x2', d => x(d.lowerLimit))
      .attr(
        'y1',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) - rectHeight / 2
      )
      .attr(
        'y2',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) + rectHeight / 2
      )
      .attr('stroke', theme.palette.grey[700]);

    boxContainer
      .append('line')
      .attr('x1', d => x(d.upperLimit))
      .attr('x2', d => x(d.upperLimit))
      .attr(
        'y1',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) - rectHeight / 2
      )
      .attr(
        'y2',
        d => y(d.tissueSiteDetailId.replace(/_/g, ' ')) + rectHeight / 2
      )
      .attr('stroke', theme.palette.grey[700]);

    boxContainer
      .selectAll('circle')
      .data(d => {
        return d.outliers.map(outlier => ({
          tissueSiteDetailId: d.tissueSiteDetailId,
          outlier,
        }));
      })
      .join('circle')
      .attr('r', outlierRadius)
      .attr('cx', d => x(d.outlier))
      .attr('cy', d => y(d.tissueSiteDetailId.replace(/_/g, ' ')))
      .attr('fill', 'none')
      .attr('stroke', theme.palette.grey[700]);

    const xAxis = d3.axisTop(x);
    const yAxis = d3.axisLeft(y);

    const customAxis = (g, axis) => {
      g.call(axis);
      g.select('.domain').attr('stroke', theme.palette.grey[700]);
      g.selectAll('.tick line').attr('stroke', theme.palette.grey[700]);
      g.selectAll('.tick text').attr('fill', theme.palette.grey[700]);
    };

    d3.select(this.xAxisRef.current).call(customAxis, xAxis);
    d3.select(this.yAxisRef.current).call(customAxis, yAxis);
  }
}

export default withTheme(GtexVariability);
