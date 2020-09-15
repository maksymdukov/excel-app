import * as types from 'redux/types';
import {
  APPLY_STYLE,
  CHANGE_ACCESS_TIME,
  CHANGE_STYLES,
  CHANGE_TITLE,
} from 'redux/types';
import { defaultStyles, defaultTitle } from 'constant';

const initState = {
  title: defaultTitle,
  colState: {},
  rowState: {},
  numberState: {}, // {'0:1': 'fewfew'}
  formulaState: {}, // {'0:1': '$A1 + $A2'}
  stylesState: {},
  currentText: '',
  currentStyles: defaultStyles,
  lastTimeAccessed: Date.now(),
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
    case types.TABLE_CHANGE_NUMBER:
      return {
        ...state,
        currentText: action.payload.text,
        numberState: {
          ...state.numberState,
          [action.payload.id]: action.payload.text,
        },
        formulaState: {
          ...state.formulaState,
          ...(action.payload.clearFormula && { [action.payload.id]: '' }),
        },
      };
    case types.TABLE_CHANGE_FORMULA:
      return {
        ...state,
        currentText: action.payload.formula,
        formulaState: {
          ...state.formulaState,
          [action.payload.id]: action.payload.formula,
        },
        numberState: {
          ...state.numberState,
          ...(action.payload.clearText && { [action.payload.id]: '' }),
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
    case CHANGE_ACCESS_TIME:
      return {
        ...state,
        lastTimeAccessed: Date.now(),
      };
    default:
      return state;
  }
};
