const actions = {
  TOGGLE_CHARACTER_CREATION: 'UI_TOGGLE_CHARACTER_CREATION',
  TOGGLE_CHARACTER_CREATION_SUCCESS: 'UI_TOGGLE_CHARACTER_CREATION_SUCCESS',
  TOGGLE_CHARACTER_CREATION_FAILURE: 'UI_TOGGLE_CHARACTER_CREATION_FAILURE',
  toggleCharacterCreation: () => ({
    type: actions.TOGGLE_CHARACTER_CREATION,
  }),
};

export default actions;