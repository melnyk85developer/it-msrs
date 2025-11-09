import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppSettings from './router/Router';
import { routeMain as routeSettings } from "./SettingsMyProfile/settingProfileContainer";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename={routeSettings()}>
    <AppSettings />
  </BrowserRouter>
);
