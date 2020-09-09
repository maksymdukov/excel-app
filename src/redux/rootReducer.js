import * as types from 'redux/types';
import { APPLY_STYLE, CHANGE_STYLES, CHANGE_TITLE } from 'redux/types';
import { defaultStyles, defaultTitle } from 'constant';

const initState = {
  title: defaultTitle,
  colState: {},
  rowState: {},
  dataState: {}, // {'0:1': 'fewfew'}
  stylesState: {},
  currentText: '',
  currentStyles: defaultStyles,
};

export const rootReducer = (state = initState, action) => {
  switch (action.type) {
    case types.TABLE_RESIZE:
      const rowOrColState =
        action.payload.type === 'col' ? 'colState' : 'rowState';
      return {
        ...state,
        [rowOrColState]: {
          ...state[rowOrColState],
          [action.payload.id]: action.payload.value,
        },
      };
    case types.TABLE_CHANGE_TEXT:
      return {
        ...state,
        currentText: action.payload.text,
        dataState: {
          ...state.dataState,
          [action.payload.id]: action.payload.text,
        },
      };
    case CHANGE_STYLES:
      return {
        ...state,
        currentStyles: { ...state.currentStyles, ...action.payload },
      };
    case APPLY_STYLE:
      const newStyles = action.payload.ids.reduce((acc, id) => {
        acc[id] = { ...state.stylesState[id], ...action.payload.style };
        return acc;
      }, {});
      return {
        ...state,
        stylesState: {
          ...state.stylesState,
          ...newStyles,
        },
        currentStyles: {
          ...state.currentStyles,
          ...action.payload.style,
        },
      };
    case CHANGE_TITLE:
      return {
        ...state,
        title: action.payload,
      };
    default:
      return state;
  }
};
