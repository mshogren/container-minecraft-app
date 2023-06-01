import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnyVariables, UseMutationState, UseQueryArgs } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import {
  ServerIdInput,
  ServerInstanceData,
  ServerStatus,
  ServerType,
  StartServer,
  StopServer,
  useGetServerByIdQuery,
  useStartServerMutation,
  useStopServerMutation,
} from './ServerQueries';
import { formatDate, getEnumKeyByEnumValue } from './utils';

function ServerDetails() {
  const { serverId } = useParams();

  const response = useGetServerByIdQuery({
    variables: { serverId } as AnyVariables,
    requestPolicy: 'network-only',
  } as UseQueryArgs);

  const [initialStartResult, startServer] = useStartServerMutation();
  const [startResult, setStartResult] = useState(initialStartResult);
  const [initialStopResult, stopServer] = useStopServerMutation();
  const [stopResult, setStopResult] = useState(initialStopResult);

  const handleStartClick = () => {
    setStartResult({ ...startResult, fetching: true });
    startServer({ serverId } as ServerIdInput).then((result) =>
      setStartResult({ ...result, fetching: false } as UseMutationState<
        StartServer,
        ServerIdInput
      >)
    );
  };

  const handleStopClick = () => {
    setStopResult({ ...stopResult, fetching: true });
    stopServer({ serverId } as ServerIdInput).then((result) =>
      setStopResult({ ...result, fetching: false } as UseMutationState<
        StopServer,
        ServerIdInput
      >)
    );
  };

  const serverDetails = (
    transientStatus: string | undefined,
    { server }: ServerInstanceData
  ) => {
    const { created, name, ports, started, status, type } = server;
    const formattedPorts =
      ports.length > 0 ? (
        ports.map((p) =>
          p.hostPort ? `${window.location.hostname}:${p.hostPort} ` : ''
        )
      ) : (
        <span>&nbsp;</span>
      );
    const buttonText =
      transientStatus ??
      (status === ServerStatus.Unavailable ? 'Start' : 'Stop');
    const buttonTitle = buttonText.toLowerCase();
    const buttonDisabled = transientStatus !== undefined;
    const handleButtonClick =
      status === ServerStatus.Unavailable ? handleStartClick : handleStopClick;

    return (
      <div>
        <form className="pure-form">
          <fieldset>
            <button
              title={buttonTitle}
              className="pure-button"
              type="button"
              disabled={buttonDisabled}
              onClick={handleButtonClick}
            >
              {buttonText}
            </button>
          </fieldset>
        </form>
        <table className="pure-table vertical-table">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
            <tr>
              <th>Type</th>
            </tr>
            <tr>
              <th>Status</th>
            </tr>
            <tr>
              <th>Ports</th>
            </tr>
            <tr>
              <th>Started</th>
            </tr>
            <tr>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{name}</td>
            </tr>
            <tr>
              <td>{getEnumKeyByEnumValue(ServerType, type)}</td>
            </tr>
            <tr>
              <td>{getEnumKeyByEnumValue(ServerStatus, status)}</td>
            </tr>
            <tr>
              <td>{formattedPorts}</td>
            </tr>
            <tr>
              <td>{formatDate(started)}</td>
            </tr>
            <tr>
              <td>{formatDate(created)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="content">
      <GraphQLComponent<ServerInstanceData, AnyVariables>
        content={{
          response,
          successRenderer: serverDetails.bind(null, undefined),
        }}
        mutations={[
          {
            result: startResult,
            loadingRenderer: serverDetails.bind(null, 'Starting'),
            onErrorClick: () => {
              setStartResult(EmptyMutationState);
            },
          },
          {
            result: stopResult,
            loadingRenderer: serverDetails.bind(null, 'Stopping'),
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
