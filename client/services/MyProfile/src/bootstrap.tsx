import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeMyProfile }  from './MyProfile/MyProfileContainer';
import AppProfile from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename={routeMyProfile()}>
    <AppProfile />
  </BrowserRouter>
);
