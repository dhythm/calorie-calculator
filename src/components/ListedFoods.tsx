import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../styles';
import Empty from './Empty';
import Loading from './Loading';

interface Food {
  name: string;
  cal: number;
}

interface Props {
  listedFoods: Food[];
  searchingText: string;
  weight: number;
  setSelectedFoods: (prev) => void;
}

const ListedFoods: React.FunctionComponent<Props> = ({
  listedFoods,
  searchingText,
  weight,
  setSelectedFoods,
}) => {
  const classes = useStyles();

  if (!searchingText) {
    return (
      <Box className={classes.container}>
        <Empty />
      </Box>
    );
  }

  if (!listedFoods) {
    return (
      <Box className={classes.container}>
        <Loading />
      </Box>
    );
  }

  return (
    <>
      {!!searchingText && listedFoods && (
        <TableContainer className={classes.container} component={Paper}>
          <Table
            size="small"
            className={classes.table}
            stickyHeader
            aria-label="foods table"
          >
            <TableBody>
              {listedFoods
                .map((d) => ({
                  ...d,
                  name: d.name
                    .replace(/＜.*＞（.*）/g, '')
                    .replace(/＜.*＞/g, '')
                    .replace(/^.*［.*］[ 　]/g, '')
                    .replace(/^[ 　]/g, ''),
                }))
                .filter((d) => {
                  const re = new RegExp(searchingText, 'i');
                  return !!d.name.match(re);
                })
                .map((d, i) => {
                  return (
                    <TableRow
                      key={i}
                      hover
                      onClick={(e) =>
                        setSelectedFoods((prev) =>
                          prev.concat({
                            name: d.name,
                            cal: d.cal,
                            gram: weight,
                          }),
                        )
                      }
                    >
                      <TableCell scope="row">
                        <Typography variant="caption">{d.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="caption">
                          {(d.cal * weight) / 100}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default ListedFoods;
