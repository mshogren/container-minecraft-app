import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from 'urql';
import {
  AddServerError,
  AddVanillaServer,
  AddVanillaServerInput,
  ADD_VANILLA_SERVER,
} from './ServerQueries';
import { ServerNameInput } from './utils';
import { GET_VERSIONS, VersionListData } from './VersionQueries';

function ServerAddVanilla() {
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [err, setErr] = useState('');

  const navigate = useNavigate();

  const [{ data, fetching, error }] = useQuery<VersionListData>({
    query: GET_VERSIONS,
  });

  const [mutationResult, addServer] = useMutation<
    AddVanillaServer,
    AddVanillaServerInput
  >(ADD_VANILLA_SERVER);

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

  const versions = (versionData: VersionListData) => {
    return versionData.versions.map((v) => (
      <option key={v} value={v}>
        {v}
      </option>
    ));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    addServer({ name, version }).then((result) => {
      if (result.error) setErr(result.error.message);
      else if (result.data) {
        const apiError = result.data.addVanillaServer as AddServerError;
        if (apiError.error) setErr(apiError.error);
        else navigate('/servers');
      }
    });
  };

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleVersionChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setVersion(event.target.value);
  };

  return (
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
          {versions(data as VersionListData)}
        </select>
      </fieldset>
      <button className="pure-button pure-button-primary" type="submit">
        Add
      </button>
    </form>
  );
}

export default ServerAddVanilla;
