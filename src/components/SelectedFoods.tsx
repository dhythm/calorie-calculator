import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
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

  if (selectedFoods.length === 0) {
    return <></>;
  }

  return (
    <>
      <Box paddingY="0.5em">
        <Typography>Selected</Typography>
      </Box>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          size="small"
          className={classes.table}
          stickyHeader
          aria-label="selected foods"
        >
          <TableBody>
            {selectedFoods.map((v, i) => {
              return (
                <TableRow key={i}>
                  <TableCell scope="row">
                    <Typography variant="caption">{v.name}</Typography>
                  </TableCell>
                  <TableCell className={classes.padding0} align="right">
                    <Typography variant="caption">{`${
                      (v.cal * v.gram) / 100
                    }kcal`}</Typography>
                    <br />
                    <Typography variant="caption">{`
                      (${v.gram}g)`}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      className={classes.padding0}
                      aria-label="delete"
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

      <Box paddingY="1em">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography>Total</Typography>
          <Typography>
            {`${selectedFoods.reduce((acc, cur) => {
              const sum = acc + cur.cal;
              return sum;
            }, 0)}kcal`}
          </Typography>
        </Box>
      </Box>
    </>
  );

  return (
    <>
      {selectedFoods.length > 0 &&
        selectedFoods.map((v, i) => (
          <Box
            key={i}
            display="flex"
            flexDirection="row"
            className={classes.paddingX}
            alignItems="center"
          >
            <Box flexGrow={1}>
              <Typography variant="caption">{v.name}</Typography>
              <br />
              <Typography variant="caption">
                {(v.cal * v.gram) / 100}kcal
              </Typography>
              <Typography variant="caption"> ({v.gram}g)</Typography>
            </Box>
            <Box>
              <IconButton
                className={classes.padding0}
                aria-label="delete"
                onClick={() =>
                  setSelectedFoods((prev) => prev.filter((_, idx) => i !== idx))
                }
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        ))}
    </>
  );
};

export default SelectedFoods;
