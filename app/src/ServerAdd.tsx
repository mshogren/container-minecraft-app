import { ChangeEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function ServerTypeDropdown() {
  const navigate = useNavigate();
  const location = useLocation();

  const routes = location.pathname.split('/');
  let path = routes[routes.length - 1];
  path = path === 'add' ? '' : path;

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    navigate(`${path === '' ? '' : '../add/'}${event.target.value}`);
  };

  return (
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
  );
}

function ServerAdd() {
  return (
    <div className="content">
      <ServerTypeDropdown />
      <p>Please select a type of server to add from the dropdown.</p>
    </div>
  );
}

export default ServerAdd;
