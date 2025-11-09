import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeUsers }  from './Music/MusicContainer';
import AppMusic from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter basename={routeUsers()}>
    <AppMusic />
  </BrowserRouter>
);