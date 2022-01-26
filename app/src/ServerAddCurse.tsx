import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddCurseServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { ModpackListData, useGetModpacksQuery } from './ModpackQueries';
import { GraphQLComponent } from './GraphQLComponents';

function ServerAddCurse() {
  const response = useGetModpacksQuery();

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
    <GraphQLComponent<ModpackListData, object>
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
  );
}

export default ServerAddCurse;
