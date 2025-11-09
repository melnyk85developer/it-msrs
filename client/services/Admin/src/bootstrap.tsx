import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppMyAdminRout from './router/Router';
import { routeMain as routeMyAdmin }  from './AdminPanel';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename="/admin">
    <AppMyAdminRout />
  </BrowserRouter>
);