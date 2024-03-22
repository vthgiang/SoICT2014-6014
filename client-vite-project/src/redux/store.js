import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './combine-reducers'
import { IntlActions } from 'react-redux-multilingual'
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware
      // loggerMiddleware
    )
  )
)

const lang = localStorage.getItem('lang')
if (lang !== null) {
  switch (lang) {
    case 'en':
    case 'vn':
      store.dispatch(IntlActions.setLocale(lang))
      break
    default:
      localStorage.setItem('lang', 'vn')
      store.dispatch(IntlActions.setLocale('vn'))
      break
  }
} else {
  localStorage.setItem('lang', 'vn')
  store.dispatch(IntlActions.setLocale('vn'))
}

export default store
