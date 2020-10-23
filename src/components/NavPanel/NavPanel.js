import React from 'react';
import { Drawer } from '@material-ui/core';

import GoBackButton from './GoBackButton';
import navPanelStyles from './navPanelStyles';
import SectionList from './SectionList';

function NavPanel({ ...props }) {
  const classes = navPanelStyles();

  return (
    <Drawer
      variant="permanent"
      classes={{ root: classes.drawer, paper: classes.paper }}
    >
      <GoBackButton />
      <SectionList {...props} />
    </Drawer>
  );
}

export default NavPanel;
