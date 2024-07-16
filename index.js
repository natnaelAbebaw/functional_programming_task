const produce = require("immer").produce;

const {
  EventReducer,
  logActions,
  dispatchEvent,
  undoAction,
  redoAction,
  saveState,
  EVENT_TYPES,
} = require("./store");

// Initial data store
let dataStore = {
  user: null,
  cart: [],
};

// Simulate some events
const simulateEvents = () => {
  // User logs in
  const loginEvent = {
    type: EVENT_TYPES.USER_LOGGED_IN,
    payload: {
      user: { id: 1, name: "natty" },
    },
  };
  dataStore = saveState(loginEvent)(dataStore);
  console.log("After login:", dataStore);

  // Add item to cart
  const addItemEvent = {
    type: EVENT_TYPES.ITEM_ADDED_TO_CART,
    payload: {
      item: { id: 101, name: "Laptop", price: 999.99 },
    },
  };
  dataStore = saveState(addItemEvent)(dataStore);
  console.log("After adding item to cart:", dataStore);

  // Remove item from cart
  const removeItemEvent = {
    type: EVENT_TYPES.ITEM_REMOVED_FROM_CART,
    payload: {
      item: { id: 101 },
    },
  };
  dataStore = saveState(removeItemEvent)(dataStore);
  console.log("After removing item from cart:", dataStore);

  // Undo the last action
  dataStore = undoAction(dataStore);
  console.log("After undo:", dataStore);

  // Redo the last undone action
  dataStore = redoAction(dataStore);
  console.log("After redo:", dataStore);
};

// Run the simulation
simulateEvents();
