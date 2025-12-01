import { PropsWithChildren, ReactElement, useEffect } from 'react';
import { Routes, Route, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth, hasAuthParams } from 'react-oidc-context';
import './App.css';
import Servers from './Servers';

function ProtectedRoute({ children }: PropsWithChildren): ReactElement {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  const auth = useAuth();

  useEffect(() => {
    if (
      auth.settings.authority &&
      !hasAuthParams() &&
      !auth.isAuthenticated &&
      !auth.activeNavigator &&
      !auth.isLoading
    ) {
      auth.signinRedirect({ state: window.location.pathname });
    }
  }, [
    auth.isAuthenticated,
    auth.activeNavigator,
    auth.isLoading,
    auth.signinRedirect,
    auth,
  ]);

  if (auth.activeNavigator) {
    return <div className="loader">Signing in...</div>;
  }

  if (auth.settings.authority && !auth.isAuthenticated) {
    return (
      <div className="content">
        <p>Error :(</p>
        <p>{auth.error?.message}</p>
        <button type="button" className="pure-button" onClick={handleClick}>
          OK
        </button>
      </div>
    );
  }

  return children as ReactElement;
}

function Layout() {
  const auth = useAuth();

  const handleClick = () => {
    if (!auth.isAuthenticated) auth.signinRedirect();
    if (auth.isAuthenticated) auth.removeUser();
  };

  return (
    <div>
      <nav className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">
            <Link className="pure-menu-link" to="/">
              Home
            </Link>
          </li>
          <li className="pure-menu-item">
            <Link className="pure-menu-link" to="/servers">
              Servers
            </Link>
          </li>
        </ul>
        {auth.settings.authority && (
          <ul className="pure-menu-list auth">
            <li className="pure-menu-item">
              <Link className="pure-menu-link" to="/" onClick={handleClick}>
                {auth.isAuthenticated ? 'Logout' : 'Login'}
              </Link>
            </li>
          </ul>
        )}
      </nav>
      <main className="content-wrapper">
        <Outlet />
      </main>
    </div>
  );
}

function Home() {
  return (
    <div className="splash-container">
      <div className="splash">
        <h1 className="splash-head">Container Minecraft App</h1>
        <p className="splash-subhead">
          A containerized app that provides a nifty interface for managing your
          containerized Minecraft servers.
        </p>

        <p>
          <Link
            to="servers"
            role="button"
            className="pure-button pure-button-primary"
          >
            GET STARTED
          </Link>
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <h1>Container Minecraft App</h1>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="servers/*"
            element={
              <ProtectedRoute>
                <Servers />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
