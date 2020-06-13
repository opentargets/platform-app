import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const styles = () => ({
  footer: {
    backgroundColor: '#3a4454',
    padding: '10px',
  },
  footerText: {
    color: 'white',
  },
});

const CustomFooter = ({ classes }) => {
  return (
    <Grid
      container
      className={classes.footer}
      direction="column"
      alignItems="center"
    >
      <Grid item>
        <Typography className={classes.footerText}>Company name</Typography>
      </Grid>
      <Grid item>
        <Typography className={classes.footerText}>
          Support: support@company.com
        </Typography>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(CustomFooter);
