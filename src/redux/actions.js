import {
  APPLY_STYLE,
  CHANGE_ACCESS_TIME,
  CHANGE_STYLES,
  CHANGE_TITLE,
  TABLE_CHANGE_NUMBER,
  TABLE_RESIZE,
  TABLE_CHANGE_FORMULA,
} from 'redux/types';

export const tableResize = ({ id, value, type }) => ({
  type: TABLE_RESIZE,
  payload: { id, value, type },
});

export const changeNumber = ({ text, id, clearFormula }) => ({
  type: TABLE_CHANGE_NUMBER,
  payload: { text, id, clearFormula },
});

export const changeFormula = ({ formula, id, clearText }) => ({
  type: TABLE_CHANGE_FORMULA,
  payload: { formula, id, clearText },
});

export const changeStyles = (styles) => ({
  type: CHANGE_STYLES,
  payload: styles,
});

export const applyStyle = ({ style, ids }) => ({
  type: APPLY_STYLE,
  payload: { style, ids },
});

export const changeTitle = (title) => ({
  type: CHANGE_TITLE,
  payload: title,
});

export const changeAccessTime = () => ({
  type: CHANGE_ACCESS_TIME,
});
