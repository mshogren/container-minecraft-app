import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';
import {
  QueryComponent,
  formatDate,
  GET_SERVER_BY_ID,
  ServerInstanceData,
} from './ServerQueries';

function ServerDetails() {
  const { serverId } = useParams();

  const response = useQuery<ServerInstanceData>({
    query: GET_SERVER_BY_ID,
    variables: { serverId },
    requestPolicy: 'network-only',
  });

  const serverDetails = ({ server }: ServerInstanceData) => {
    return (
      <table className="pure-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{server.name}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{server.status}</td>
          </tr>
          <tr>
            <th>Created</th>
            <td>{formatDate(server.created)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="content">
      <QueryComponent<ServerInstanceData, object>
        response={response}
        renderer={serverDetails}
      />
    </div>
  );
}

export default ServerDetails;
