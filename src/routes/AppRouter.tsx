import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RoleRoute } from './RoleRoute';
import { PATHS } from './paths';
import { LoginView } from '../views/LoginView';
import { NotFoundView } from '../views/NotFoundView';
import { PlaceholderView } from '../views/PlaceholderView';
import { AuthRoute } from './AuthRoute';
import { AppLayout } from '../components/layout/AppLayout';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthRoute access="public" />}>
        <Route path={PATHS.login} element={<LoginView />} />
      </Route>

      <Route element={<AuthRoute access="private" />}>
        <Route element={<AppLayout />}>
            <Route path={PATHS.dashboard} element={<PlaceholderView title="Dashboard" />} />
            <Route path={PATHS.inventory} element={<PlaceholderView title="Inventario" />} />
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path={PATHS.users} element={<PlaceholderView title="Usuarios" />} />
            </Route>
            <Route path="*" element={<NotFoundView />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);