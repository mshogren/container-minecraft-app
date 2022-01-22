import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { useQuery } from 'urql';
import ServerDetails from './ServerDetails';
import {
  QueryComponent,
  formatDate,
  GET_SERVERS,
  ServerListData,
} from './ServerQueries';

function ServerList() {
  const response = useQuery<ServerListData>({
    query: GET_SERVERS,
    requestPolicy: 'network-only',
  });

  const servers = (data: ServerListData) => {
    return (
      <div>
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
          <Route path=":serverId" element={<ServerDetails />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Servers;
