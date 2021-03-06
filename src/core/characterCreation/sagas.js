import { takeEvery, put, select } from 'redux-saga/effects';
import { v4 as uuidv4 } from 'uuid';
import characterCreationActions from 'core/characterCreation/actions';
import partyActions from 'core/party/actions';

function* addCharacter(action) {
  const party = yield select((state) => state.party.characters);
  const stats = {
    ...action.payload,
    id: uuidv4(),
    level: 1,
    name: action.payload.name.charAt(0).toUpperCase() + action.payload.name.slice(1),
    HP_MAX: parseInt(50 + action.payload.STR * 4, 10),
    ENERGY_MAX: parseInt(action.payload.INT * 3, 10),
    buffs: [],
    debuffs: [],
    inventory: [],
  };
  stats.HP_CUR = stats.HP_MAX;
  stats.ENERGY_CUR = stats.ENERGY_MAX;

  try {
    if (party.length >= 5 || party.find((m) => m.name === stats.name)) {
      return;
    }

    yield put(partyActions.addCharacter(stats));
    yield put(characterCreationActions.reset());
  } catch (e) {
    console.log(e);
  }
}

export default [takeEvery(characterCreationActions.ADD_CHARACTER, addCharacter)];
