import { Routes, Route, Outlet, Link } from 'react-router-dom';
import './App.css';

function Layout() {
  return (
    <div>
      <nav className="home-menu pure-menu pure-menu-horizontal pure-menu-fixed">
        <ul className="pure-menu-list">
          <li className="pure-menu-item">
            <Link className="pure-menu-link" to="/">
              Home
            </Link>
          </li>
        </ul>
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

        <p>Nothing here</p>
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
          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
