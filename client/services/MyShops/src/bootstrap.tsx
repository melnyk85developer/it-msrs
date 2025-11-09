import ReactDOM from 'react-dom/client';
import AppMyShops from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeMyShops }  from './Shop/myShopsContainer';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter basename={routeMyShops()}>
    <AppMyShops />
  </BrowserRouter>
);