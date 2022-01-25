import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useQuery } from 'urql';
import { QueryComponent } from './GraphQLComponents';
import ServerAdd from './ServerAdd';
import ServerDetails from './ServerDetails';
import { GET_SERVERS, ServerListData } from './ServerQueries';
import { formatDate } from './utils';

function ServerList() {
  const [response, reexecuteQuery] = useQuery<ServerListData>({
    query: GET_SERVERS,
    requestPolicy: 'network-only',
  });

  const servers = (data: ServerListData) => {
    return (
      <div>
        <form className="pure-form">
          <fieldset>
            <Link to="add" role="button">
              <button className="pure-button" type="button">
                Add
              </button>
            </Link>
            <button
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
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.servers.length > 0 ? (
              data.servers.map((server) => {
                const { id, name, status, created } = server;
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{status}</td>
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
      <QueryComponent<ServerListData, object>
        response={response}
        renderer={servers}
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
          <Route path=":serverId" element={<ServerDetails />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Servers;
