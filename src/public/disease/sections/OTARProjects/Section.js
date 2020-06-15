import React from 'react';
import { Link, OtTableRF } from 'ot-ui';

const columns = [
  {
    id: 'otarCode',
    label: 'Project Code',
  },
  {
    id: 'projectName',
    label: 'Project Name',
  },
  {
    id: 'status',
    label: 'Status',
  },
  {
    id: 'reference',
    label: 'Open Targets Intranet Link',
    renderCell: ({ otarCode, reference }) => {
      return (
        <Link to={reference} external>
          {otarCode} project page
        </Link>
      );
    },
  },
];

const Section = ({ data }) => {
  return <OtTableRF columns={columns} data={data} />;
};

export default Section;
