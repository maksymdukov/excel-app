import { defaultStyles } from 'constant';
import { stylesObjToString } from 'core/utils';
import { CODES, DEFAULT_WIDTH, DEFAULT_HEIGHT } from './table.constants';

function createCell({ col, row, width, cellContent, cellStyles }) {
  const dataValue = cellContent.formula || '';
  const innerContent = cellContent.number || cellContent.error || '';
  const styles = stylesObjToString({ ...defaultStyles, ...cellStyles });
  return `
  <div 
    contenteditable="true" 
    class="cell" 
    data-col="${col}" 
    data-row="${row}" 
    data-id="${row}:${col}" 
    data-type="cell"
    data-value="${dataValue}"
    style="${styles}; width:${width}"
    >
    ${innerContent}
    <div class="resize-handle"></div>
  </div>
  `;
}

function createCol({ char, width }, idx) {
  return `
  <div 
    class="column" 
    data-type="resizable" 
    data-col="${idx}"
    style="width: ${width}"
  >
    ${char}
    <div class="col-resize" data-resize="col"></div>
  </div>  
  `;
}

function createRow(rowIdx, columns, rowState) {
  const rowHeight = getHeight(rowState, rowIdx);
  return `
  <div 
  class="row" 
  data-type="resizable" 
  ${rowIdx ? `data-row="${rowIdx}"` : ''}
  style="height:${rowHeight}"
>
    <div class="row-info">${rowIdx}
      ${rowIdx ? '<div class="row-resize" data-resize="row"></div>' : ''}
    </div>
    <div class="row-data" ${
      rowIdx ? `data-row-number="${rowIdx}"` : ''
    }>${columns}</div>  
  </div>
  `;
}

function toChar(_, idx) {
  return String.fromCharCode(CODES.A + idx);
}

function getWidth(state, index) {
  return `${state[index] || DEFAULT_WIDTH}px`;
}

function getHeight(state, index) {
  return `${state[index] || DEFAULT_HEIGHT}px`;
}

function withColumnDataFrom(state) {
  return (char, idx) => {
    const width = getWidth(state.colState, idx);
    return { char, width };
  };
}

function withCellDataFrom(state, row, cellResolver) {
  return (_, idx) => {
    const cellId = `${row}:${idx}`;
    const width = getWidth(state.colState, idx);
    const cellFormula = state.formulaState[cellId];
    const cellNumber = state.numberState[cellId];
    const cellContent = cellResolver.parseValue(
      cellFormula || cellNumber,
      cellId
    );
    const cellStyles = state.stylesState[cellId];
    return { row, width, col: idx, cellContent, cellStyles };
  };
}

export function createTable(rowsCount = 15, tableState, cellResolver) {
  const colsCount = CODES.Z - CODES.A;

  const rows = [];

  const cols = Array.from({ length: colsCount })
    .map(toChar)
    .map(withColumnDataFrom(tableState))
    .map(createCol)
    .join('');
  // table header
  rows.push(createRow('', cols, tableState.rowState));
  // table body
  for (let row = 0; row < rowsCount; row++) {
    const dataCols = Array.from({ length: colsCount })
      .map(withCellDataFrom(tableState, row, cellResolver))
      .map(createCell)
      .join('');
    rows.push(createRow(row + 1, dataCols, tableState.rowState));
  }

  return rows.join('');
}
