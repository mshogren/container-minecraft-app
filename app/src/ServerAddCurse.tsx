import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import {
  AddCurseforgeServer,
  AddCurseforgeServerInput,
  AddServerError,
  ADD_CURSEFORGE_SERVER,
} from './ServerQueries';
import { ServerNameInput } from './utils';
import { GET_MODPACKS, ModpackListData } from './ModpackQueries';

function ServerAddCurse() {
  const [name, setName] = useState('');
  const [modpack, setModpack] = useState('');
  const [err, setErr] = useState('');

  const navigate = useNavigate();

  const [{ data, fetching, error }] = useQuery<ModpackListData>({
    query: GET_MODPACKS,
  });

  const [mutationResult, addServer] = useMutation<
    AddCurseforgeServer,
    AddCurseforgeServerInput
  >(ADD_CURSEFORGE_SERVER);

  const handleClick = () => {
    navigate('/servers');
  };

  if (fetching || mutationResult.fetching) return <p>Loading...</p>;
  if (err || error || mutationResult.error)
    return (
      <>
        <p>Error :(</p>
        <button type="button" className="pure-button" onClick={handleClick}>
          OK
        </button>
      </>
    );

  const modpacks = (modpackData: ModpackListData) => {
    return modpackData.modpacks.map((m) => (
      <option key={m.id} value={m.id}>
        {m.name}
      </option>
    ));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addServer({ name, modpack }).then((result) => {
      if (result.error) setErr(result.error.message);
      else if (result.data) {
        const apiError = result.data.addCurseforgeServer as AddServerError;
        if (apiError.error) setErr(apiError.error);
        else navigate('/servers');
      }
    });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleModpackChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModpack(event.target.value);
  };

  return (
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
          {modpacks(data as ModpackListData)}
        </select>
      </fieldset>
      <button className="pure-button pure-button-primary" type="submit">
        Add
      </button>
    </form>
  );
}

export default ServerAddCurse;
