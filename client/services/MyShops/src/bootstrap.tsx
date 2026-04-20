import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeMyShops } from './MyShops/routes';
import AppShops from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter basename={routeMyShops()}>
    <AppShops />
  </BrowserRouter>
);