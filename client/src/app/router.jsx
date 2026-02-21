import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';
import AppShell from './components/AppShell';
import Loader from '../components/common/Loader';
import FeatureComingSoon from '../components/common/FeatureComingSoon';
import useAuth from '../features/auth/hooks/useAuth';

const featurePages = import.meta.glob('../features/**/pages/*.{js,jsx}');

const lazyComponentCache = new WeakMap();

function toPascalCase(value) {
  return String(value || '')
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function getLazyComponent(importer) {
  if (!importer) return null;
  if (!lazyComponentCache.has(importer)) {
    lazyComponentCache.set(importer, lazy(importer));
  }
  return lazyComponentCache.get(importer);
}

function resolveFeatureImporter(featureName, preferredFileBaseNames = []) {
  const prefix = `../features/${featureName}/pages/`;
  const matches = Object.keys(featurePages).filter((key) => key.startsWith(prefix));
  if (!matches.length) return null;

  const pascal = toPascalCase(featureName);
  const candidates = [
    ...preferredFileBaseNames,
    `${pascal}Page`,
    pascal,
    'index',
  ];

  for (const baseName of candidates) {
    const found = matches.find(
      (key) => key.endsWith(`/${baseName}.jsx`) || key.endsWith(`/${baseName}.js`),
    );
    if (found) return featurePages[found];
  }

  matches.sort();
  return featurePages[matches[0]];
}

class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('Route render failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return <FeatureComingSoon featureName={this.props.featureName} />;
    }
    return this.props.children;
  }
}

function LazyRoute({ importer, featureName }) {
  if (!importer) return <FeatureComingSoon featureName={featureName} />;

  const Component = getLazyComponent(importer);
  if (!Component) return <FeatureComingSoon featureName={featureName} />;

  return (
    <RouteErrorBoundary featureName={featureName}>
      <Suspense fallback={<Loader label="Loading…" />}>
        <Component />
      </Suspense>
    </RouteErrorBoundary>
  );
}

function RootLayout() {
  return <Outlet />;
}

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isBootstrapping, isAuthenticated } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-(--border) bg-(--bg-surface) p-6 shadow-sm">Loading session…</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default function makeRouter() {
  const authLoginImporter = resolveFeatureImporter('auth', ['LoginPage']);
  const authSignupImporter = resolveFeatureImporter('auth', ['SignupPage']);

  const vehiclesImporter = resolveFeatureImporter('vehicles', ['VehiclesPage', 'Vehicles']);
  const driversImporter = resolveFeatureImporter('drivers', ['DriverProfiles']);
  const expensesImporter = resolveFeatureImporter('expenses', ['ExpensesPage', 'ExpenseFuel', 'Expenses']);
  const analyticsImporter = resolveFeatureImporter('analytics', ['Analytics']);

  return createBrowserRouter([
    { path: '/login', element: <LazyRoute importer={authLoginImporter} featureName="login" /> },
    { path: '/signup', element: <LazyRoute importer={authSignupImporter} featureName="register" /> },
    { path: '/register', element: <LazyRoute importer={authSignupImporter} featureName="register" /> },
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <FeatureComingSoon />,
      children: [
        { index: true, element: <Navigate to="/dashboard" replace /> },
        {
          element: <AppShell />,
          errorElement: <FeatureComingSoon />,
          children: [
            {
              path: 'dashboard',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={() => import('./pages/DashboardPage')} featureName="dashboard" />
                </ProtectedRoute>
              ),
            },
            {
              path: 'trips',
              element: (
                <ProtectedRoute>
                  <LazyRoute
                    importer={resolveFeatureImporter('trips', ['TripDispatcher', 'TripDispatcherPage']) || (() => import('./pages/TripDispatcherPage'))}
                    featureName="trips"
                  />
                </ProtectedRoute>
              ),
            },
            {
              path: 'dispatch',
              element: <Navigate to="/trips" replace />,
            },
            {
              path: 'vehicles',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={vehiclesImporter} featureName="vehicles" />
                </ProtectedRoute>
              ),
            },
            {
              path: 'maintenance',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={resolveFeatureImporter('maintenance')} featureName="maintenance" />
                </ProtectedRoute>
              ),
            },
            {
              path: 'drivers',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={driversImporter} featureName="drivers" />
                </ProtectedRoute>
              ),
            },
            {
              path: 'expenses',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={expensesImporter} featureName="expenses" />
                </ProtectedRoute>
              ),
            },
            {
              path: 'analytics',
              element: (
                <ProtectedRoute>
                  <LazyRoute importer={analyticsImporter} featureName="analytics" />
                </ProtectedRoute>
              ),
            },
            {
              path: '*',
              element: (
                <ProtectedRoute>
                  <FeatureComingSoon />
                </ProtectedRoute>
              ),
            },
          ],
        },
      ],
    },
  ]);
}

