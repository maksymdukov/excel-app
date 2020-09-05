const CODES = {
  A: 65,
  Z: 90,
};

function createCell(content, idx) {
  return `
  <div class="cell" data-col="${idx}">
    ${content}
    <div class="resize-handle"></div>
  </div>
  `;
}

function createCol(char, idx) {
  return `
  <div class="column" data-type="resizable" data-col="${idx}">
    ${char}
    <div class="col-resize" data-resize="col"></div>
  </div>  
  `;
}

function createRow(info, columns) {
  return `
  <div class="row" data-type="resizable">
    <div class="row-info">${info}
      ${info ? `<div class="row-resize" data-resize="row"></div>` : ''}
    </div>
    <div class="row-data" ${
      info ? `data-row-number="${info}"` : ''
    }>${columns}</div>  
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
      .map((_, idx) => createCell('', idx))
      .join('');
    rows.push(createRow(i + 1, dataCols));
  }

  return rows.join('');
}
