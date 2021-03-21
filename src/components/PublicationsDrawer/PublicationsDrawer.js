import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  Drawer,
  Link as MUILink,
  makeStyles,
  Typography,
  Paper,
  CircularProgress,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { naLabel } from '../../constants';
import { europePmcSearchPOSTQuery } from '../../utils/urls';
import PublicationWrapper from './PublicationWrapper';

const sourceDrawerStyles = makeStyles(theme => ({
  drawerLink: {
    cursor: 'pointer',
  },
  drawerBody: {
    overflowY: 'overlay',
  },
  drawerModal: {
    '& .MuiBackdrop-root': {
      opacity: '0 !important',
    },
  },
  drawerPaper: {
    backgroundColor: theme.palette.grey[300],
  },
  drawerTitle: {
    borderBottom: '1px solid #ccc',
    padding: '1rem',
  },
  drawerTitleCaption: {
    color: theme.palette.grey[700],
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  AccordionExpanded: {
    margin: '1rem !important',
  },
  AccordionRoot: {
    border: '1px solid #ccc',
    margin: '1rem 1rem 0 1rem',
    padding: '1rem',
    '&::before': {
      backgroundColor: 'transparent',
    },
  },
  AccordionSubtitle: {
    color: theme.palette.grey[400],
    fontSize: '0.8rem',
    fontStyle: 'italic',
  },
  AccordionTitle: {
    color: theme.palette.grey[700],
    fontSize: '1rem',
    fontWeight: 'bold',
  },
  summaryBoxRoot: {
    marginRight: '2rem',
  },
}));

const listComponetStyles = makeStyles(theme => ({
  loader: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  AccordionSubtitle: {
    color: theme.palette.grey[400],
    fontSize: '0.8rem',
    fontStyle: 'italic',
  },
  ListContent: {
    backgroundColor: 'white',
  },
}));

const ListComponet = ({ entriesIds }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => {
      const { baseUrl, formBody } = europePmcSearchPOSTQuery(entriesIds);
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: formBody,
      };
      fetch(baseUrl, requestOptions)
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          setPublications(data.resultList.result);
        });
    },
    [entriesIds]
  );

  if (loading)
    return (
      <Box
        my={20}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <CircularProgress size={60} />
        <Box mt={6}>
          <Typography className={listComponetStyles.AccordionSubtitle}>
            Loading EuropePMC search
          </Typography>
        </Box>
      </Box>
    );

  const parsedPublications = publications.map(pub => {
    const row = {};
    row.europePmcId = pub.id;
    row.title = pub.title;
    row.year = pub.pubYear;
    row.abstract = pub.abstractText;
    row.openAccess = pub.isOpenAccess === 'N' ? false : true;
    row.authors = pub.authorList?.author || [];
    row.journal = {
      ...pub.journalInfo,
      page: pub.pageInfo,
    };
    return row;
  });

  return (
    <Box my={3} mx={3} p={3} bgcolor="white">
      {parsedPublications.map(publication => (
        <PublicationWrapper key={publication.europePmcId} {...publication} />
      ))}
    </Box>
  );
};

function PublicationsDrawer({ entries, message, caption = 'Records' }) {
  const [open, setOpen] = useState(false);
  const classes = sourceDrawerStyles();

  const entriesIds = entries.map(entrie => entrie.name);

  if (entries.length === 0) {
    return naLabel;
  }

  const toggleDrawer = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  return (
    <>
      <MUILink onClick={toggleDrawer} className={classes.drawerLink}>
        {message
          ? message
          : entries.length === 1
          ? entries[0].name
          : `${entries.length} entries`}
      </MUILink>

      <Drawer
        anchor="right"
        classes={{ modal: classes.drawerModal, paper: classes.drawerPaper }}
        open={open}
        onClose={closeDrawer}
      >
        <Paper classes={{ root: classes.drawerTitle }} elevation={0}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography className={classes.drawerTitleCaption}>
              {caption}
            </Typography>
            <IconButton onClick={closeDrawer}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Paper>

        <Box width={500} className={classes.drawerBody}>
          {open && <ListComponet entriesIds={entriesIds} />}
        </Box>
      </Drawer>
    </>
  );
}

export default PublicationsDrawer;