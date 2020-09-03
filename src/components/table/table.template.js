const CODES = {
  A: 65,
  Z: 90,
};

function createCell(content) {
  return `
  <div class="cell">${content}</div>
  `;
}

function createCol(char) {
  return `
  <div class="column">
    ${char}
  </div>  
  `;
}

function createRow(info, columns) {
  return `
  <div class="row">
    <div class="row-info">${info}</div>
    <div class="row-data">${columns}</div>  
  </div>
  `;
}

function toChar(_, idx) {
  return String.fromCharCode(CODES.A + idx);
}

export function createTable(rowsCount = 15) {
  const colsCount = CODES.Z - CODES.A;

  const rows = [];

  const cols = Array.from({ length: colsCount })
    .map(toChar)
    .map(createCol)
    .join('');
  // table header
  rows.push(createRow('', cols));

  // table body
  for (let i = 0; i < rowsCount; i++) {
    const dataCols = Array.from({ length: colsCount })
      .map(() => createCell(''))
      .join('');
    rows.push(createRow(i + 1, dataCols));
  }

  return rows.join('');
}
