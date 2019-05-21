import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import coreReducers from './reducers';
import coreSagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

const initialState = {
  splash: {
    show: true,
    text: '',
  },
  dialog: {
    show: true,
    text: '',
  },
  characterCreation: {
    show: false,
  },
  /*
  party: {
    characters: [],
    buffs: [],
    debuffs: [],
  },
  characters: [],
  */
};

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  coreReducers,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(coreSagas);

export default store;
