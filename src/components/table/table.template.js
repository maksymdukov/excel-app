const CODES = {
  A: 65,
  Z: 90,
};

function createCell(rowIdx) {
  return function (_, colIdx) {
    return `
  <div contenteditable="true" class="cell" data-col="${colIdx}" data-row="${rowIdx}" data-id="${rowIdx}:${colIdx}" data-type="cell">
    <div class="resize-handle"></div>
  </div>
  `;
  };
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
  for (let row = 0; row < rowsCount; row++) {
    const dataCols = Array.from({ length: colsCount })
      .map(createCell(row))
      .join('');
    rows.push(createRow(row + 1, dataCols));
  }

  return rows.join('');
}
