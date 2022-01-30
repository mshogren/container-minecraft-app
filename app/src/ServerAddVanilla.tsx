import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseMutationState } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import { ServerTypeDropdown } from './ServerAdd';
import { useAddVanillaServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { useGetVersionsQuery, VersionListData } from './VersionQueries';

function ServerAddVanilla() {
  const response = useGetVersionsQuery();

  const [mutationResult, setMutationResult] = useState(EmptyMutationState);
  const [, addServer] = useAddVanillaServerMutation();

  const [name, setName] = useState('');
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [version, setVersion] = useState('');
  const handleVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setVersion(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMutationResult({ ...mutationResult, fetching: true });
    addServer({ name, version }).then((result) =>
      setMutationResult(result as UseMutationState)
    );
  };

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/servers');
  };

  const success = () => (
    <>
      <p>Added :)</p>
      <button type="button" className="pure-button" onClick={handleClick}>
        OK
      </button>
    </>
  );

  const addServerForm = (data: VersionListData) => (
    <>
      <ServerTypeDropdown />
      <form className="pure-form" onSubmit={handleSubmit}>
        <p>Add a Vanilla server by specifying a name and version</p>
        <fieldset>
          <ServerNameInput name={name} onChange={handleNameChange} />
          <select
            className="pure-input-1"
            defaultValue={version}
            required
            onChange={handleVersionChange}
          >
            <option value="" disabled hidden>
              Choose a server version
            </option>
            {data.versions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </fieldset>
        <button className="pure-button pure-button-primary" type="submit">
          Add
        </button>
      </form>
    </>
  );

  return (
    <div className="content">
      <GraphQLComponent<VersionListData, object>
        query={{ response, successRenderer: addServerForm }}
        mutations={[
          {
            result: mutationResult,
            onErrorClick: () => {
              setMutationResult(EmptyMutationState);
            },
            loadingMessage: 'Adding...',
            successRenderer: success,
          },
        ]}
      />
    </div>
  );
}

export default ServerAddVanilla;
