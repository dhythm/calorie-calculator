import { Grid, TextField } from '@material-ui/core/';
import React, { useEffect, useState } from 'react';
import XLSX from 'xlsx';
import ListedFoods from './components/ListedFoods';
import SelectedFoods from './components/SelectedFoods';
import { useStyles } from './styles';

const App: React.FunctionComponent = () => {
  const classes = useStyles();

  const [data, setData] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [weight, setWeight] = useState(100);
  const [selectedFoods, setSelectedFoods] = useState([]);

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
      <Grid container spacing={1} className={classes.padding}>
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
            onChange={(e) => setWeight(Number(e.target.value) || 0)}
            inputMode="numeric"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <ListedFoods
            listedFoods={data}
            searchingText={searchText}
            weight={weight}
            setSelectedFoods={setSelectedFoods}
          />
        </Grid>

        <Grid item xs={12}>
          <SelectedFoods
            selectedFoods={selectedFoods}
            setSelectedFoods={setSelectedFoods}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default App;
