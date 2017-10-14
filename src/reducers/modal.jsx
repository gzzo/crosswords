const OPEN_MODAL = 'modal/OPEN_MODAL';
const CLOSE_MODAL = 'modal/CLOSE_MODAL';

export const openModal = (modalName, data) => {
  return {
    type: OPEN_MODAL,
    modalName,
    data,
  }
}

export const closeModal = (modalName) => {
  console.log('moo')
  return {
    type: CLOSE_MODAL,
    modalName,
  }
}

export function reducer(state = {}, action) {
  switch (action.type) {
    case OPEN_MODAL: {
      return {
        ...state,
        activeModal: action.modalName,
        [action.modalName]: {
          data: action.data,
        }
      }
    }

    case CLOSE_MODAL: {
      return {
        ...state,
        activeModal: null,
      }
    }

    default: {
      return state;
    }
  }
}
