import { useParams } from 'react-router-dom';
import { UseQueryArgs } from 'urql';
import { QueryComponent } from './GraphQLComponents';
import { ServerInstanceData, useGetServerByIdQuery } from './ServerQueries';
import { formatDate } from './utils';

function ServerDetails() {
  const { serverId } = useParams();

  const [response] = useGetServerByIdQuery({
    variables: { serverId },
    requestPolicy: 'network-only',
  } as UseQueryArgs);

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
