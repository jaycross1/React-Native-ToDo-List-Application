import { createStore } from 'redux'
//imports counter function which shows how many files have to be imported
//creates a state tree, it manages the whole state of the application
//it takes the data from the component global 
//ayschonrous lets you cache data
function counter(state = 0, action) {
  switch (action.type) {
    case 'SET':
      return action.value 
    default:
      return state
  }
}

let store = createStore(counter)

export default store;