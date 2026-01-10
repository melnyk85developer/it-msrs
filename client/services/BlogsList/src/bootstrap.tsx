import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { routeMain as routeBlogs }  from './BlogListContainer';
import AppAllBlogs from './router/Router';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter basename={routeBlogs()}>
    <AppAllBlogs />
  </BrowserRouter>
);