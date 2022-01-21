import { Routes, Route, Outlet } from 'react-router-dom';
import { gql, useQuery } from 'urql';

export const GET_SERVERS = gql`
  query GetServers {
    servers {
      created
      gameVersion
      id
      image {
        name
        tag
      }
      name
      ports {
        hostPort
        port
      }
      started
      status
      type
      volumes {
        name
        source
      }
    }
  }
`;

interface ImageData {
  name: string;
  tag: string;
}

interface PortData {
  hostPort: number;
  port: string;
}

interface VolumeData {
  name: string;
  source: string;
}

interface ServerData {
  created: Date;
  gameVersion: string;
  id: string;
  image: ImageData;
  name: string;
  ports: PortData[];
  started: Date;
  status: string;
  type: string;
  volume: VolumeData[];
}

interface ServerListData {
  servers: ServerData[];
}

function ServerList() {
  const [{ data, fetching, error }] = useQuery<ServerListData>({
    query: GET_SERVERS,
    requestPolicy: 'network-only',
  });

  if (fetching) return <p>Loading...</p>;
  if (error || !data) return <p>Error :(</p>;

  const servers =
    data.servers.length > 0 ? (
      data.servers.map((server) => {
        const { id, name, status, created } = server;
        const formattedCreated = new Date(
          Date.parse(created.toString())
        ).toLocaleString('en-CA');
        return (
          <tr key={id}>
            <td>{name}</td>
            <td>{status}</td>
            <td>{formattedCreated}</td>
          </tr>
        );
      })
    ) : (
      <tr>Nothing here</tr>
    );

  return (
    <div>
      <table className="content pure-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Status</td>
            <td>Created</td>
          </tr>
        </thead>
        <tbody>{servers}</tbody>
      </table>
    </div>
  );
}

function Servers() {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<ServerList />} />
        </Route>
      </Routes>
    </div>
  );
}

export default Servers;
