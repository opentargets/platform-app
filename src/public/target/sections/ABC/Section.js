import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import * as d3 from 'd3';

import GtexVariability from './GtexVariability';
import logo from './logo.png';

const transformData = data => {
  return data.map(d => {
    d.data.sort((a, b) => a - b);
    const median = d3.median(d.data);
    const q1 = d3.quantile(d.data, 0.25);
    const q3 = d3.quantile(d.data, 0.75);
    const outliers = [];
    const notoutliers = [];
    const iqr = q3 - q1; // interquartile range

    d.data.forEach(d => {
      if (d < q1 - 1.5 * iqr || d > q3 + 1.5 * iqr) {
        outliers.push(d);
      } else {
        notoutliers.push(d);
      }
    });

    return {
      tissueSiteDetailId: d.tissueSiteDetailId,
      median,
      q1,
      q3,
      lowerLimit: notoutliers[0],
      upperLimit: notoutliers[notoutliers.length - 1],
      outliers,
    };
  });
};

// This is an example of a section that makes calls to a third party API
class Section extends Component {
  state = {
    loading: true,
  };

  async componentDidMount() {
    const { symbol } = this.props;
    const body = await fetch(
      `https://www.gtexportal.org/rest/v1/reference/gene?geneId=${symbol}&v=clversion`
    ).then(res => res.json());

    const { gencodeId } = body.gene[0];
    const res = await fetch(
      `https://www.gtexportal.org/rest/v1/expression/geneExpression?boxplotDetail=full&gencodeId=${gencodeId}`
    ).then(res => res.json());

    this.setState({ loading: false, data: transformData(res.geneExpression) });
  }

  render() {
    const { loading, data } = this.state;
    return (
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <img src={logo} alt="ABC logo" width="100" />
        </Grid>
        {loading ? 'loading...' : <GtexVariability data={data} />}
      </Grid>
    );
  }
}

export default Section;
