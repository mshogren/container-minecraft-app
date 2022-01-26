import { Navigate, To, useParams } from 'react-router-dom';
import { UseQueryArgs } from 'urql';
import { GraphQLComponent } from './GraphQLComponents';
import {
  ServerIdInput,
  ServerInstanceData,
  useGetServerByIdQuery,
  useStartServerMutation,
  useStopServerMutation,
} from './ServerQueries';
import { formatDate } from './utils';

function ServerDetails() {
  const { serverId } = useParams();

  const response = useGetServerByIdQuery({
    variables: { serverId },
    requestPolicy: 'network-only',
  } as UseQueryArgs);

  const [startResult, startServer] = useStartServerMutation();
  const [stopResult, stopServer] = useStopServerMutation();

  const handleStartClick = () => {
    startServer({ serverId } as ServerIdInput);
  };

  const handleStopClick = () => {
    stopServer({ serverId } as ServerIdInput);
  };

  const success = () => <Navigate to={0 as To} />;

  const serverDetails = ({ server }: ServerInstanceData) => {
    return (
      <div>
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
        <form className="pure-form">
          <fieldset>
            <button
              className="pure-button"
              type="button"
              onClick={handleStartClick}
            >
              Start
            </button>
            <button
              className="pure-button"
              type="button"
              onClick={handleStopClick}
            >
              Stop
            </button>
          </fieldset>
        </form>
      </div>
    );
  };

  return (
    <div className="content">
      <GraphQLComponent<ServerInstanceData, object>
        response={response}
        renderer={serverDetails}
        mutations={[
          {
            result: startResult,
            errorClickRoute: '.',
            successRenderer: success,
          },
          {
            result: stopResult,
            errorClickRoute: '.',
            successRenderer: success,
          },
        ]}
      />
    </div>
  );
}

export default ServerDetails;
