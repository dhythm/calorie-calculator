import {
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from '@material-ui/core/';
import { Clear as ClearIcon } from '@material-ui/icons/';
import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    margin: {
      margin: theme.spacing(1),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    container: {
      maxHeight: 440,
    },
    table: {
      width: '100%',
    },
  }),
);

const App: React.FunctionComponent = () => {
  const classes = useStyles();

  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [weight, setWeight] = useState(100);
  const [selectedFood, setSelectedFood] = useState([]);

  useEffect(() => {
    fetch('./assets/standard_tables_of_food_composition_in_japan.xlsx')
      .then((res) => {
        const stream = res.body;
        return stream;
      })
      .then((stream) => new Response(stream))
      .then((response) => response.blob())
      .then((blob) => {
        blob.arrayBuffer().then((buffer) => {
          const workbook = XLSX.read(buffer, { type: 'buffer' });
          const sheet = XLSX.utils
            .sheet_to_csv(workbook.Sheets['本表'], {
              FS: '\u001F',
            })
            .split('\n')
            .map((row) => {
              return row.split('\u001F').map((field) => {
                if (/^$/.test(field)) {
                  return null;
                } else if (/^true$/i.test(field)) {
                  return true;
                } else if (/^false$/i.test(field)) {
                  return false;
                } else if (
                  /^((|-)((\d{1,3},){0,}\d{3}|\d+)|0(X|x)[0-9a-fA-F]+|0(B|b)[0-1]+)$/.test(
                    field,
                  )
                ) {
                  const s = field.replace(/,/g, '');
                  const n = Number(s);
                  return Number.isSafeInteger(n) ? n : BigInt(s);
                } else {
                  return String(field);
                }
              });
            })
            .filter((v, i) => v.length === 68);

          const unitRow = sheet[3];
          const dataRow = (sheet as any[]).filter((v) =>
            String(v[0]).match(/^\d*$/g),
          );
          const calIdx = unitRow.findIndex((v) => v === 'エネルギー（kcal）');

          setData(
            dataRow.map((d, i) => ({
              id: i,
              name: d[3],
              cal: d[calIdx],
            })),
          );
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <TextField
            id="Search"
            label="Search"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            // onBlur={(e) => setSearchText(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            id="weight"
            label="Weight (g)"
            variant="outlined"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            inputMode="numeric"
            fullWidth
          />
        </Grid>
      </Grid>

      {!data && <>Loading...</>}

      {data && !!searchText && (
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
              {data
                .filter((d) => {
                  const re = new RegExp(searchText, 'i');
                  return !!d.name.match(re);
                })
                .map((d) => {
                  return (
                    <TableRow
                      key={d.name}
                      hover
                      onClick={(e) =>
                        setSelectedFood((prev) =>
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

      {selectedFood.length > 0 && (
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
              {selectedFood.map((d, i) => {
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
                          setSelectedFood((prev) =>
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
    </div>
  );
};

export default App;
