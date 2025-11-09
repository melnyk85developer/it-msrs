import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeUserProfile }  from '../src/UserProfile/UserProfileContainer';
import AppUserProfile from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// basename={routeUserProfile()}
root.render(
  <BrowserRouter basename={routeUserProfile()}>
    <AppUserProfile />
  </BrowserRouter>
);
