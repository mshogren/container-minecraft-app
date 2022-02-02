import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { UseMutationState, UseQueryArgs } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import {
  ServerIdInput,
  ServerInstanceData,
  StartServer,
  StopServer,
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

  const [initialStartResult, startServer] = useStartServerMutation();
  const [startResult, setStartResult] = useState(initialStartResult);
  const [initialStopResult, stopServer] = useStopServerMutation();
  const [stopResult, setStopResult] = useState(initialStopResult);

  const handleStartClick = () => {
    setStartResult({ ...startResult, fetching: true });
    startServer({ serverId } as ServerIdInput).then((result) =>
      setStartResult(result as UseMutationState<StartServer, ServerIdInput>)
    );
  };

  const handleStopClick = () => {
    setStopResult({ ...stopResult, fetching: true });
    stopServer({ serverId } as ServerIdInput).then((result) =>
      setStopResult(result as UseMutationState<StopServer, ServerIdInput>)
    );
  };

  const serverDetails = ({ server }: ServerInstanceData) => {
    return (
      <div>
        <form className="pure-form">
          <fieldset>
            <button
              title="start"
              className="pure-button"
              type="button"
              onClick={handleStartClick}
            >
              Start
            </button>
            <button
              title="stop"
              className="pure-button"
              type="button"
              onClick={handleStopClick}
            >
              Stop
            </button>
          </fieldset>
        </form>
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
      </div>
    );
  };

  return (
    <div className="content">
      <GraphQLComponent<ServerInstanceData, object>
        content={{ response, successRenderer: serverDetails }}
        mutations={[
          {
            result: startResult,
            onErrorClick: () => {
              setStartResult(EmptyMutationState);
            },
          },
          {
            result: stopResult,
            onErrorClick: () => {
              setStopResult(EmptyMutationState);
            },
          },
        ]}
      />
    </div>
  );
}

export default ServerDetails;
