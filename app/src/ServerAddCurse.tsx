import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useClient, UseMutationState } from 'urql';
import { EmptyMutationState, GraphQLComponent } from './GraphQLComponents';
import { GET_MODPACKS, ModpackData, ModpackListData } from './ModpackQueries';
import { ServerTypeDropdown } from './ServerAdd';
import {
  AddCurseforgeServer,
  AddCurseforgeServerInput,
  useAddCurseServerMutation,
} from './ServerQueries';
import { InfiniteListbox, ServerNameInput } from './utils';

interface ModpackClickHandler {
  (event: MouseEvent<HTMLOptionElement>, modpacks: ModpackData[]): void;
}

function ModpackListbox(props: {
  search: string;
  modpackId: string;
  handleModpackClick: ModpackClickHandler;
}) {
  const { search, modpackId, handleModpackClick } = props;

  const initialState = {
    hasNextPage: true,
    isNextPageLoading: false,
    hasError: false,
    items: [] as ModpackData[],
    page: 0,
  };

  const [
    { hasNextPage, isNextPageLoading, hasError, items, page },
    setListboxState,
  ] = useState(initialState);

  const client = useClient();

  const getModpacks = () => {
    setListboxState({
      hasNextPage,
      isNextPageLoading: true,
      hasError: false,
      items,
      page,
    });

    const query = client.query(GET_MODPACKS, {
      search: encodeURI(search),
      page,
    });

    query.toPromise().then((result) => {
      if (result.error)
        setListboxState({
          hasNextPage: false,
          isNextPageLoading: false,
          hasError: true,
          items: [{} as ModpackData],
          page,
        });
      else if (result.data?.modpacks?.length > 0)
        setListboxState({
          hasNextPage: result.data.modpacks.length > 0,
          isNextPageLoading: false,
          hasError: false,
          items: [...items].concat(result.data.modpacks),
          page: page + 1,
        });
      else
        setListboxState({
          hasNextPage: false,
          isNextPageLoading: false,
          hasError: false,
          items,
          page,
        });
    });
  };

  return (
    <InfiniteListbox
      hasNextPage={hasNextPage}
      isNextPageLoading={isNextPageLoading}
      hasError={hasError}
      items={items.map((m) => ({
        key: m.id,
        value: m.id,
        text: m.name,
      }))}
      loadNextPage={() => new Promise<void>(getModpacks)}
      className="pure-input-1"
      selected={modpackId}
      handleClick={(e) => handleModpackClick(e, items)}
    />
  );
}

function ServerAddCurse() {
  const [name, setName] = useState('');
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const [modpack, setModpack] = useState(null as unknown as ModpackData);
  const handleModpackClick = (
    event: MouseEvent<HTMLOptionElement>,
    modpacks: ModpackData[]
  ) => {
    setModpack(
      modpacks.find((m) => m.id === event.currentTarget.value) as ModpackData
    );
  };

  const [search, setSearch] = useState('');
  const handleSearch = () => {
    const searchInput = document.getElementById('search') as HTMLInputElement;
    setSearch(searchInput?.value ?? '');
    setModpack(null as unknown as ModpackData);
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
      event.preventDefault();
    }
  };

  const [initialMutationResult, addServer] = useAddCurseServerMutation();
  const [mutationResult, setMutationResult] = useState(initialMutationResult);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setMutationResult({ ...mutationResult, fetching: true });
    addServer({ name, modpackId: modpack.id }).then((result) =>
      setMutationResult({ ...result, fetching: false } as UseMutationState<
        AddCurseforgeServer,
        AddCurseforgeServerInput
      >)
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

  function modpackInfo() {
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

  const addServerForm = () => (
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
              <input
                id="search"
                type="text"
                placeholder="Search"
                defaultValue={search}
                onKeyDown={handleKeyDown}
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
            <ModpackListbox
              search={search}
              modpackId={modpack ? modpack.id : ''}
              handleModpackClick={handleModpackClick}
            />
          </div>
          <div className="list-details pure-u-1 pure-u-md-1-2">
            {modpackInfo()}
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
        content={addServerForm()}
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
