import React from 'react';
import { makeStyles, Tooltip as MUITooltip } from '@material-ui/core';
import _ from 'lodash';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faInfoCircle,
  faInfo,
  faQuestion,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';

function Tooltip({ style, children, title, showHelpIcon = false, ...props }) {
  const classes = makeStyles(theme =>
    _.merge(style, {
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.grey[300]}`,
        color: theme.palette.text.primary,
      },
      tooltipBadge: {
        paddingLeft: '1rem',
        top: '.4rem',
      },
      tooltipIcon: {
        fontWeight: '500',
        cursor: 'default',
      },
      infoIcon: {
        color: ' #3489CA',
        cursor: 'default',
        position: 'relative',
        bottom: '0.35rem',
        fontSize: '0.75rem',
        paddingLeft: '0.1rem',
      },
      infoStackIcon: {
        color: ' #3489CA',
        cursor: 'default',
        position: 'relative',
        bottom: '0.35rem',
        fontSize: '0.75rem',
        paddingLeft: '0.1rem',
      },
    })
  )();

  const iconStack = (
    <span className={`fa-layers fa-fw ${classes.infoStackIcon}`}>
      <FontAwesomeIcon icon={farCircle} />
      <FontAwesomeIcon icon={faInfo} transform="shrink-6" />
    </span>
  );

  const infoIcon = (
    <span className={classes.infoIcon}>
      <FontAwesomeIcon icon={faInfoCircle} />
    </span>
  );

  return (
    <>
      {showHelpIcon && children}
      <MUITooltip
        placement="top"
        interactive
        classes={{ tooltip: classes.tooltip }}
        title={title}
        {...props}
      >
        {/* {showHelpIcon ? <sup className={classes.tooltipIcon}>?</sup> : children} */}
        {showHelpIcon ? iconStack : children}
      </MUITooltip>
    </>
  );
}

export default Tooltip;
