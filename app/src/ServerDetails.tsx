import { useParams } from 'react-router-dom';
import { useQuery } from 'urql';
import { QueryComponent } from './GraphQLComponents';
import { GET_SERVER_BY_ID, ServerInstanceData } from './ServerQueries';
import { formatDate } from './utils';

function ServerDetails() {
  const { serverId } = useParams();

  const [response] = useQuery<ServerInstanceData>({
    query: GET_SERVER_BY_ID,
    variables: { serverId },
    requestPolicy: 'network-only',
  });

  const serverDetails = ({ server }: ServerInstanceData) => {
    return (
      <table className="pure-table vertical-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
          <tr>
            <th>Status</th>
          </tr>
          <tr>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{server.name}</td>
          </tr>
          <tr>
            <td>{server.status}</td>
          </tr>
          <tr>
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
