import React, { useState } from 'react';
import XLSX from 'xlsx';

const App: React.FunctionComponent = () => {
  const [data, setData] = useState(null);

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

  return (
    <div className="App">{data ? <>Hello, world</> : <>Loading...</>}</div>
  );
};

export default App;
