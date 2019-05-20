import React, { Component } from 'react';
import classNames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';

import { Link } from 'ot-ui';

import Widget from '../Widget';
import BibliographyOverview from './Overview';
import BibliographyDetail from './Detail';
import BibliographyWidgetIcon from '../../icons/BibliographyWidgetIcon';

const styles = theme => ({
  icon: {
    width: '50px',
    height: '50px',
    fill: '#5a5f5f',
  },
  iconNoData: {
    fill: '#e2dfdf',
  },
});
const API_URL = 'https://link.opentargets.io/';
const sources = [
  {
    name: 'LINK, the Open Targets Literature Knowledge Graph',
    url: 'https://blog.opentargets.org/2018/01/18/link/',
  },
];

class BibliographyWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bibliographyCount: 0,
      hasData: false,
    };
  }

  componentDidMount() {
    const { ensgId } = this.props;
    fetch(API_URL + 'search?query=' + ensgId + '&aggs=true&size=0')
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            bibliographyCount: result.hits.total,
            hasData: result.hits.total > 0,
          });
        },
        error => {
          this.setState({
            bibliographyCount: 0,
            hasData: false,
          });
        }
      );
  }

  render() {
    const { classes, ensgId, symbol } = this.props;
    const { hasData, bibliographyCount } = this.state;
    return (
      <Widget
        title="Bibliography"
        detailUrlStem="bibliography"
        detail={
          <BibliographyDetail
            ensgId={ensgId}
            symbol={symbol}
            sources={sources}
          />
        }
        detailHeader={{
          title: <React.Fragment>{symbol} - Bibliography</React.Fragment>,
          description: (
            <React.Fragment>
              Scientific literature on {symbol}. The list of publications is
              generated by text mining PubMed abstracts with Natural Language
              Processing (NLP).
            </React.Fragment>
          ),
        }}
        hasData={hasData}
        sources={sources}
      >
        <Grid container direction="column" justify="space-between">
          <Grid item container justify="center">
            <Grid item>
              <BibliographyWidgetIcon
                className={classNames(classes.icon, {
                  [classes.iconNoData]: !hasData,
                })}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Typography
              variant="body1"
              align="center"
              color={hasData ? 'default' : 'secondary'}
            >
              <strong>{bibliographyCount}</strong> scientific publication
              {bibliographyCount > 1 ? 's' : null} on {symbol} available
            </Typography>
          </Grid>
        </Grid>
      </Widget>
    );
  }
}

BibliographyWidget.widgetName = 'bibliography';

export default withStyles(styles)(BibliographyWidget);
