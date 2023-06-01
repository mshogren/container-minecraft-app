import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { AnyVariables, UseQueryArgs } from 'urql';
import { GraphQLComponent } from './GraphQLComponents';
import ServerAdd from './ServerAdd';
import ServerAddCurse from './ServerAddCurse';
import ServerAddVanilla from './ServerAddVanilla';
import ServerDetails from './ServerDetails';
import {
  ServerListData,
  ServerStatus,
  useGetServersQuery,
} from './ServerQueries';
import { formatDate, getEnumKeyByEnumValue } from './utils';

function ServerList() {
  const response = useGetServersQuery({
    requestPolicy: 'network-only',
  } as UseQueryArgs);

  const auth = useAuth();
  const [, reexecuteQuery] = response;

  const servers = (data: ServerListData) => {
    return (
      <div>
        <form className="pure-form">
          <fieldset>
            <Link to="add" role="button">
              <button title="add" className="pure-button" type="button">
                Add
              </button>
            </Link>
            <button
              title="refresh"
              className="pure-button"
              type="button"
              onClick={reexecuteQuery}
            >
              Refresh
            </button>
          </fieldset>
        </form>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              {auth.settings.authority ? <th>Owner</th> : null}
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.servers.length > 0 ? (
              data.servers.map((server) => {
                const { id, name, owner, status, created } = server;
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{getEnumKeyByEnumValue(ServerStatus, status)}</td>
                    {auth.settings.authority ? <td>{owner ?? ' '}</td> : null}
                    <td>{formatDate(created)}</td>
                    <td>
                      <Link to={id}>Details</Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3}>Nothing here</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="content">
      <GraphQLComponent<ServerListData, AnyVariables>
        content={{ response, successRenderer: servers }}
      />
    </div>
  );
}

function Servers() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<ServerList />} />
          <Route path="add/*" element={<ServerAdd />} />
          <Route path="add/vanilla/*" element={<ServerAddVanilla />} />
          <Route path="add/curse/*" element={<ServerAddCurse />} />
          <Route path=":serverId" element={<ServerDetails />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Servers;
