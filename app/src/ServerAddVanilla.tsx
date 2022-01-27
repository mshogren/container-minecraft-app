import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraphQLComponent } from './GraphQLComponents';
import { ServerTypeDropdown } from './ServerAdd';
import { useAddVanillaServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { useGetVersionsQuery, VersionListData } from './VersionQueries';

function ServerAddVanilla() {
  const response = useGetVersionsQuery();

  const [mutationResult, addServer] = useAddVanillaServerMutation();

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
    addServer({ name, version });
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
          <ServerNameInput onChange={handleNameChange} />
          <select
            className="pure-input-1"
            defaultValue=""
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
        response={response}
        renderer={addServerForm}
        mutations={[
          {
            result: mutationResult,
            errorClickRoute: '.',
            loadingMessage: 'Adding...',
            successRenderer: success,
          },
        ]}
      />
    </div>
  );
}

export default ServerAddVanilla;
