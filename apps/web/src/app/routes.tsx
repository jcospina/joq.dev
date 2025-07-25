import { createBrowserRouter } from 'react-router';

import { Landing } from '@pages/landing/Landing';

const routes = [{ path: '/', element: <Landing /> }];
export const router = createBrowserRouter(routes);
