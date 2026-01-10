import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeBlogs }  from './MyBlogs/BlogsContainer';
import AppBlogs from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <BrowserRouter basename={routeBlogs()}>
    <AppBlogs />
  </BrowserRouter>
);