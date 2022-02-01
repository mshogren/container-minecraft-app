import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseMutationState } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import {
  ModpackData,
  ModpackListData,
  useGetModpacksQuery,
} from './ModpackQueries';
import { ServerTypeDropdown } from './ServerAdd';
import {
  AddCurseforgeServer,
  AddCurseforgeServerInput,
  useAddCurseServerMutation,
} from './ServerQueries';
import { Listbox, ServerNameInput } from './utils';

function ServerAddCurse() {
  const response = useGetModpacksQuery();

  const [initialMutationResult, addServer] = useAddCurseServerMutation();
  const [mutationResult, setMutationResult] = useState(initialMutationResult);

  const [name, setName] = useState('');
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [modpackId, setModpack] = useState('');
  const handleModpackClick = (event: MouseEvent<HTMLOptionElement>) => {
    setModpack(event.currentTarget.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMutationResult({ ...mutationResult, fetching: true });
    addServer({ name, modpackId }).then((result) =>
      setMutationResult(
        result as UseMutationState<
          AddCurseforgeServer,
          AddCurseforgeServerInput
        >
      )
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

  function modpackInfo(modpack?: ModpackData) {
    if (modpack) {
      return (
        <>
          <img
            height={128}
            src={modpack.thumbnailUrl}
            alt={`${modpack.name} thumbnail`}
          />
          <div>
            <b>{modpack.name}</b>
          </div>
          <div>{modpack.summary}</div>
        </>
      );
    }
    return '';
  }

  const addServerForm = (data: ModpackListData) => (
    <>
      <ServerTypeDropdown />
      <form className="pure-form" onSubmit={handleSubmit}>
        <p>
          Add a server with a CurseForge Modpack by specifying a name and
          modpack
        </p>
        <fieldset className="pure-g">
          <ServerNameInput name={name} onChange={handleNameChange} />
          <div className="pure-u-1 pure-u-md-2-3">
            <div className="input-container pure-u-1 pure-u-md-3-4">
              <input type="text" placeholder="Search" />
              <button className="pure-button" type="button" title="search">
                Search
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
          <div className="pure-u-1 pure-u-md-1-2">
            <Listbox
              className="pure-input-1"
              items={data.modpacks.map((m) => ({
                key: m.id,
                value: m.id,
                text: m.name,
              }))}
              selected={modpackId}
              handleClick={handleModpackClick}
            />
          </div>
          <div className="list-details pure-u-1 pure-u-md-1-2">
            {modpackInfo(data.modpacks.find((m) => m.id === modpackId))}
          </div>
        </fieldset>
        <button
          title="add"
          className="pure-button pure-button-primary"
          type="submit"
        >
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
