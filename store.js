const { produce } = require("immer");

// Initial data store
const initialState = {
  user: null,
  cart: [],
};

// Event types
const EVENT_TYPES = {
  USER_LOGGED_IN: "USER_LOGGED_IN",
  ITEM_ADDED_TO_CART: "ITEM_ADDED_TO_CART",
  ITEM_REMOVED_FROM_CART: "ITEM_REMOVED_FROM_CART",
};

// Pure EventReducer function
const EventReducer = (state, event) => {
  return produce(state, (draft) => {
    switch (event.type) {
      case EVENT_TYPES.USER_LOGGED_IN:
        draft.user = event.payload.user;
        break;
      case EVENT_TYPES.ITEM_ADDED_TO_CART:
        draft.cart.push(event.payload.item);
        break;
      case EVENT_TYPES.ITEM_REMOVED_FROM_CART:
        draft.cart = draft.cart.filter(
          (item) => item.id !== event.payload.item.id
        );
        break;
      default:
        break;
    }
  });
};

// Curried logger function
const logActions = (event) => (state) => {
  console.log(`Event Dispatched: ${JSON.stringify(event)}`);
  return state;
};

// Save state and ensure immutability
const saveState = (event) => (state) => {
  history.push(state);
  future = [];
  return logActions(event)(EventReducer(state, event));
};

// Dispatch event function with composition
const dispatchEvent = (event) => (state) => {
  const newState = saveState(event)(state);
  return logActions(event)(newState);
};

// Undo action function
const undoAction = (state) => {
  if (!history.length) {
    throw new Error("No action to undo");
  }
  future.push(state);
  return history.pop();
};

// Redo action function
const redoAction = (state) => {
  if (!future.length) {
    throw new Error("No action to redo");
  }
  history.push(state);
  return future.pop();
};

// Function to create a memoized version of a function
const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

// History for undo/redo functionality
let history = [];
let future = [];

module.exports = {
  EventReducer,
  logActions,
  dispatchEvent,
  undoAction,
  redoAction,
  saveState,
  EVENT_TYPES,
};
