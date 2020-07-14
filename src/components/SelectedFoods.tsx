import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons/';
import React from 'react';
import { useStyles } from '../styles';

interface Food {
  name: string;
  cal: number;
  gram: number;
}

interface Props {
  selectedFoods: Food[];
  setSelectedFoods: (prev) => void;
}

const SelectedFoods: React.FunctionComponent<Props> = ({
  selectedFoods,
  setSelectedFoods,
}) => {
  const classes = useStyles();

  return (
    <>
      {selectedFoods.length > 0 && (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="selected foods">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Calories (100g)</TableCell>
                <TableCell align="right">Weight (g)</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedFoods.map((d, i) => {
                return (
                  <TableRow key={i}>
                    <TableCell component="th" scope="row">
                      {d.name}
                    </TableCell>
                    <TableCell align="right">{d.cal}</TableCell>
                    <TableCell align="right">{d.gram}</TableCell>
                    <TableCell align="right">
                      {(d.cal * d.gram) / 100}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        aria-label="delete"
                        className={classes.margin}
                        onClick={() =>
                          setSelectedFoods((prev) =>
                            prev.filter((_, idx) => i !== idx),
                          )
                        }
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
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

export default SelectedFoods;
