import { ChangeEvent, FormEvent, MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseMutationState } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import { ServerTypeDropdown } from './ServerAdd';
import {
  AddVanillaServer,
  AddVanillaServerInput,
  useAddVanillaServerMutation,
} from './ServerQueries';
import { Listbox, ServerNameInput } from './utils';
import { useGetVersionsQuery, VersionListData } from './VersionQueries';

function ServerAddVanilla() {
  const response = useGetVersionsQuery();

  const [initialMutationResult, addServer] = useAddVanillaServerMutation();
  const [mutationResult, setMutationResult] = useState(initialMutationResult);

  const [name, setName] = useState('');
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [version, setVersion] = useState('');
  const handleVersionClick = (event: MouseEvent<HTMLOptionElement>) => {
    setVersion(event.currentTarget.value);
  };

  const [search, setSearch] = useState('');
  const handleSearch = () => {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    setSearch(searchInput?.value ?? '');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMutationResult({ ...mutationResult, fetching: true });
    addServer({ name, version }).then((result) =>
      setMutationResult(
        result as UseMutationState<AddVanillaServer, AddVanillaServerInput>
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

  const addServerForm = (data: VersionListData) => (
    <>
      <ServerTypeDropdown />
      <form className="pure-form" onSubmit={handleSubmit}>
        <p>Add a Vanilla server by specifying a name and version</p>
        <fieldset className="pure-g">
          <ServerNameInput name={name} onChange={handleNameChange} />
          <div className="pure-u-1 pure-u-md-2-3">
            <div className="input-container pure-u-1 pure-u-md-3-4">
              <input
                id="search"
                type="text"
                placeholder="Search"
                defaultValue={search}
              />
              <button
                className="pure-button"
                type="button"
                title="search"
                onClick={handleSearch}
              >
                Search
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
          <div className="pure-u-1 pure-u-md-1-2">
            <Listbox
              className="pure-input-1"
              items={data.versions
                .filter((v) => v.indexOf(search) > -1)
                .map((v) => ({
                  key: v,
                  value: v,
                  text: v,
                }))}
              selected={version}
              handleClick={handleVersionClick}
            />
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
      <GraphQLComponent<VersionListData, object>
        content={{ response, successRenderer: addServerForm }}
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
