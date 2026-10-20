import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RoleRoute } from './RoleRoute';
import { PATHS } from './paths';
import { LoginView } from '../views/LoginView';
import { RegisterView } from '../views/RegisterView';
import { NotFoundView } from '../views/NotFoundView';
import { AuthRoute } from './AuthRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { DashboardView } from '../views/DashboardView';
import { InventoryView } from '../views/InventoryView';
import { UsersView } from '../views/UsersView';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<AuthRoute access="public" />}>
        <Route path={PATHS.login} element={<LoginView />} />
        <Route path={PATHS.register} element={<RegisterView />} />
      </Route>

      <Route element={<AuthRoute access="private" />}>
        <Route element={<AppLayout />}>
            <Route path={PATHS.dashboard} element={<DashboardView />} />
            <Route path={PATHS.inventory} element={<InventoryView />} />            
            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
                <Route path={PATHS.users} element={<UsersView />} />
            </Route>
            <Route path="*" element={<NotFoundView />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);