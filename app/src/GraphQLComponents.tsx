import { useNavigate } from 'react-router-dom';
import { CombinedError, UseMutationState, UseQueryState } from 'urql';
import { AddServerError } from './ServerQueries';

interface RenderFunction<Data> {
  // eslint-disable-next-line no-unused-vars, no-undef
  (data: Data): JSX.Element;
}

interface UseQueryProps<Data, Variables> {
  response: UseQueryState<Data, Variables>;
  renderer: RenderFunction<Data>;
}

export function QueryComponent<Data, Variables>(
  props: UseQueryProps<Data, Variables>
) {
  const { response, renderer } = props;
  const { data, fetching, error } = response;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return renderer(data as Data);
}

interface UseMutationProps<Data, Variables>
  extends UseQueryProps<Data, Variables> {
  mutationResult: UseMutationState;
}

export function MutationComponent<Data, Variables>(
  props: UseMutationProps<Data, Variables>
) {
  const { response, mutationResult, renderer } = props;
  const { data, fetching, error } = response;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/servers');
  };

  let errorState = error || mutationResult.error;
  if (!errorState && mutationResult.data) {
    const apiError = Object.values(mutationResult.data)[0] as AddServerError;
    if (apiError.error)
      errorState = new CombinedError({ graphQLErrors: [apiError.error] });
  }

  if (errorState)
    return (
      <>
        <p>Error :(</p>
        <p>{errorState.message}</p>
        <button type="button" className="pure-button" onClick={handleClick}>
          OK
        </button>
      </>
    );

  if (mutationResult.data)
    return (
      <>
        <p>Added :)</p>
        <button type="button" className="pure-button" onClick={handleClick}>
          OK
        </button>
      </>
    );

  let loading;
  if (fetching) loading = 'Loading...';
  if (!loading && mutationResult.fetching) loading = 'Adding...';

  if (loading) return <p>{loading}</p>;

  return renderer(data as Data);
}
