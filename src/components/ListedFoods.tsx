import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { useStyles } from '../styles';
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

  if (!listedFoods) {
    return <Loading />;
  }

  return (
    <>
      {!!searchingText && listedFoods && (
        <TableContainer className={classes.container} component={Paper}>
          <Table
            className={classes.table}
            stickyHeader
            aria-label="foods table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Calories (100g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listedFoods
                .filter((d) => {
                  const re = new RegExp(searchingText, 'i');
                  return !!d.name.match(re);
                })
                .map((d) => {
                  return (
                    <TableRow
                      key={d.name}
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
                      <TableCell component="th" scope="row">
                        {d.name}
                      </TableCell>
                      <TableCell align="right">{d.cal}</TableCell>
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
