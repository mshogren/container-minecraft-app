import { ChangeEvent, FormEvent, useState } from 'react';
import { useAddCurseServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { ModpackListData, useGetModpacksQuery } from './ModpackQueries';
import { MutationComponent } from './GraphQLComponents';

function ServerAddCurse() {
  const [response] = useGetModpacksQuery();

  const [mutationResult, addServer] = useAddCurseServerMutation();

  const [name, setName] = useState('');
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [modpack, setModpack] = useState('');
  const handleModpackChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModpack(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addServer({ name, modpack });
  };

  const addServerForm = (data: ModpackListData) => (
    <form className="pure-form" onSubmit={handleSubmit}>
      <p>
        Add a server with a CurseForge Modpack by specifying a name and modpack
      </p>
      <fieldset>
        <ServerNameInput onChange={handleNameChange} />
        <select
          className="pure-input-1"
          defaultValue=""
          required
          onChange={handleModpackChange}
        >
          <option value="" disabled hidden>
            Choose a modpack
          </option>
          {data.modpacks.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
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
    <MutationComponent<ModpackListData, object>
      response={response}
      renderer={addServerForm}
      mutationResult={mutationResult}
    />
  );
}

export default ServerAddCurse;
