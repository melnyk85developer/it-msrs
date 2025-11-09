import ReactDOM from 'react-dom/client';
import { BrowserRouter, RouterProvider } from 'react-router-dom';
import AppContainer from './router/Router';
import { Provider } from 'react-redux';
import {setupStore} from '@packages/shared/src/store/redux-store';
import {AppProvider} from '@packages/shared/src/components/contexts/AppContext'
// import 'overlayscrollbars/css/OverlayScrollbars.min.css';
import './globalOverrides.scss';

const store = setupStore()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// basename="/"
root.render(
    <BrowserRouter>
      <Provider store={store}>
        <AppProvider>
          <AppContainer/>
        </AppProvider>
      </Provider>
    </BrowserRouter>
  );
