import React from 'react';
import { Hidden, TableCell, TableRow as MUITableRow } from '@material-ui/core';
import _ from 'lodash';

import { getHiddenBreakpoints } from './utils';
import { tableStyles } from './tableStyles';

function TableRow({ columns, hover, isFixedRow, noWrap, row, style }) {
  const classes = tableStyles();

  return (
    <MUITableRow
      classes={{ root: isFixedRow ? classes.rowFixed : '' }}
      hover={hover}
    >
      {columns.map((column, index) => (
        <Hidden {...getHiddenBreakpoints(column)} key={index}>
          <TableCell
            align={
              column.align ? column.align : column.numeric ? 'right' : 'left'
            }
            classes={{
              root: `
                ${classes.cell}
                ${classes.cellBody}
                ${column.numeric ? classes.tabularNums : ''}
                ${column.sticky ? classes.cellSticky : ''}
                ${noWrap ? classes.noWrap : ''}`,
            }}
            component={column.sticky ? 'th' : 'td'}
            key={index}
            style={{ ...column.style, ...row.rowStyle, ...style }}
          >
            {column.renderCell
              ? column.renderCell(row)
              : _.get(row, column.propertyPath || column.id, 'N/A')}
          </TableCell>
        </Hidden>
      ))}
    </MUITableRow>
  );
}

export default TableRow;
