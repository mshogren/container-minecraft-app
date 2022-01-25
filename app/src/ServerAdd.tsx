import { ChangeEvent } from 'react';
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import ServerAddCurse from './ServerAddCurse';
import ServerAddVanilla from './ServerAddVanilla';

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    navigate(event.target.value);
  };

  const routes = location.pathname.split('/');
  let path = routes[routes.length - 1];
  path = path === 'add' ? '' : path;

  return (
    <div className="content">
      <form className="pure-form">
        <fieldset>
          <select
            className="pure-input-1"
            defaultValue={path}
            onChange={handleSelectChange}
          >
            <option value="" disabled hidden>
              Choose a server type
            </option>
            <option value="vanilla">Vanilla</option>
            <option value="curse">Curseforge Modpack</option>
          </select>
        </fieldset>
      </form>
      <Outlet />
    </div>
  );
}

function Default() {
  return <p>Please select a type of server to add from the dropdown.</p>;
}

function ServerAdd() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Default />} />
          <Route path="vanilla/*" element={<ServerAddVanilla />} />
          <Route path="curse/*" element={<ServerAddCurse />} />
        </Route>
      </Routes>
    </div>
  );
}

export default ServerAdd;
