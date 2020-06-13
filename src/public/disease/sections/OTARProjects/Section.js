import React from 'react';
import { Link, OtTableRF } from 'ot-ui';

const getColumns = name => {
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
      id: 'name',
      label: 'Disease',
      renderCell: () => name,
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
  return columns;
};

const Section = ({ name, data }) => {
  const columns = getColumns(name);
  return <OtTableRF columns={columns} data={data} />;
};

export default Section;
