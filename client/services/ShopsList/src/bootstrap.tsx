import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeShops }  from './ShopListContainer';
import AppUserShop from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename={routeShops()}>
    <AppUserShop />
  </BrowserRouter>
);