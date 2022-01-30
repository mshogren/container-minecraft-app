import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseMutationState } from 'urql';
import { useAddCurseServerMutation } from './ServerQueries';
import { ServerNameInput } from './utils';
import { ModpackListData, useGetModpacksQuery } from './ModpackQueries';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import { ServerTypeDropdown } from './ServerAdd';

function ServerAddCurse() {
  const response = useGetModpacksQuery();

  const [mutationResult, setMutationResult] = useState(EmptyMutationState);
  const [, addServer] = useAddCurseServerMutation();

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
    setMutationResult({ ...mutationResult, fetching: true });
    addServer({ name, modpack }).then((result) =>
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

  const addServerForm = (data: ModpackListData) => (
    <>
      <ServerTypeDropdown />
      <form className="pure-form" onSubmit={handleSubmit}>
        <p>
          Add a server with a CurseForge Modpack by specifying a name and
          modpack
        </p>
        <fieldset>
          <ServerNameInput name={name} onChange={handleNameChange} />
          <select
            className="pure-input-1"
            defaultValue={modpack}
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
    </>
  );

  return (
    <div className="content">
      <GraphQLComponent<ModpackListData, object>
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

export default ServerAddCurse;
