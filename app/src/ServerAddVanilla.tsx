import { ChangeEvent, FormEvent, useState } from 'react';
import { MutationComponent } from './GraphQLComponents';
import { useAddVanillaServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { useGetVersionsQuery, VersionListData } from './VersionQueries';

function ServerAddVanilla() {
  const [response] = useGetVersionsQuery();

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

  const addServerForm = (data: VersionListData) => (
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
  );

  return (
    <MutationComponent<VersionListData, object>
      response={response}
      renderer={addServerForm}
      mutationResult={mutationResult}
    />
  );
}

export default ServerAddVanilla;
