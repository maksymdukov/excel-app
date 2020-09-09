import {
  APPLY_STYLE,
  CHANGE_ACCESS_TIME,
  CHANGE_STYLES,
  CHANGE_TITLE,
  TABLE_CHANGE_TEXT,
  TABLE_RESIZE,
} from 'redux/types';

export const tableResize = ({ id, value, type }) => ({
  type: TABLE_RESIZE,
  payload: { id, value, type },
});

export const changeText = ({ text, id }) => ({
  type: TABLE_CHANGE_TEXT,
  payload: { text, id },
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
