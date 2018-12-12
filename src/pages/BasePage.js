import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import { NavBar, Footer } from 'ot-ui';

import { externalLinks } from '../constants';

const styles = theme => ({
  container: {
    paddingTop: '40px',
    paddingBottom: '40px',
  },
});

const BasePage = ({ children, classes }) => {
  return (
    <Fragment>
      <Helmet
        defaultTitle="Open Targets Platform"
        titleTemplate="%s | Open Targets Platform"
      />
      <NavBar name="Platform" />
      <Grid className={classes.container} container justify="space-around">
        <Grid item md={10}>
          {children}
        </Grid>
      </Grid>
      <Footer externalLinks={externalLinks} />
    </Fragment>
  );
};

export default withStyles(styles)(BasePage);
