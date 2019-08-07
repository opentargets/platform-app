import React, { Component, Fragment } from 'react';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  detailPanel: {
    background: `${theme.palette.grey[100]}`,
    marginTop: '10px',
    padding: '20px',
  },
});

class BibliograhpyDetailPanel extends Component {
  render = () => {
    const { classes, children } = this.props;

    return <div className={this.props.classes.detailPanel}>{children}</div>;
  };
}

export default withStyles(styles)(BibliograhpyDetailPanel);
