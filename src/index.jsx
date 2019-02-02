import React from 'react'
import ReactDOM from 'react-dom'
import {AppContainer} from 'react-hot-loader'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {PersistGate} from 'redux-persist/integration/react'
import {persistReducer, persistStore} from 'redux-persist'
import {applyMiddleware, createStore} from 'redux'
import {reducers, rootSaga} from 'reducers'
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga'
import storage from 'redux-persist/lib/storage'


import {App} from 'App'

const persistConfig = {
  key: 'root',
  storage,
}

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  persistReducer(persistConfig, reducers), composeWithDevTools(
  applyMiddleware(sagaMiddleware)),
)
sagaMiddleware.run(rootSaga)

const persistor = persistStore(store)

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </AppContainer>,
    document.getElementById('root'),
  )
}

if (module.hot) {
  module.hot.accept('App', render)
  module.hot.accept('reducers', () => store.replaceReducer(reducers))
}

render()
