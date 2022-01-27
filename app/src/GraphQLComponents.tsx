import { useNavigate } from 'react-router-dom';
import { CombinedError, UseMutationState, UseQueryResponse } from 'urql';
import { ServerError } from './ServerQueries';

interface RenderFunction<Data> {
  // eslint-disable-next-line no-unused-vars, no-undef
  (data: Data): JSX.Element;
}

export interface QueryConfiguration<Data, Variables> {
  response: UseQueryResponse<Data, Variables>;
  errorClickRoute?: string;
  renderer: RenderFunction<Data>;
}

export interface MutationConfiguration {
  result: UseMutationState;
  loadingMessage?: string;
  errorClickRoute: string;
  successRenderer: RenderFunction<never>;
}

export interface GraphQLComponentProps<Data, Variables> {
  response: UseQueryResponse<Data, Variables>;
  errorClickRoute?: string;
  renderer: RenderFunction<Data>;
  mutations?: MutationConfiguration[];
}

export function GraphQLComponent<Data, Variables>(
  props: GraphQLComponentProps<Data, Variables>
) {
  const { response, errorClickRoute, mutations, renderer } = props;
  const [{ data, fetching, error }] = response;

  const navigate = useNavigate();

  let clickRoute = errorClickRoute ?? '/';
  let errorState = error;
  mutations?.forEach((mutation) => {
    if (!errorState) {
      errorState = errorState || mutation.result.error;
      if (errorState) clickRoute = mutation.errorClickRoute;
    }
    if (!errorState && mutation.result.data) {
      const apiError = Object.values(mutation.result.data)[0] as ServerError;
      if (apiError.error) {
        errorState = new CombinedError({ graphQLErrors: [apiError.error] });
        clickRoute = mutation.errorClickRoute;
      }
    }
  });

  if (errorState) {
    const handleClick = () => {
      if (clickRoute === '.') navigate(0);
      else navigate(clickRoute);
    };

    return (
      <>
        <p>Error :(</p>
        <p>{errorState.message}</p>
        <button type="button" className="pure-button" onClick={handleClick}>
          OK
        </button>
      </>
    );
  }

  let mutationData;
  let successRenderer: RenderFunction<never> = () => <div />;

  mutations?.forEach((mutation) => {
    if (mutation.result.data) {
      mutationData = mutation.result.data;
      successRenderer = mutation.successRenderer;
    }
  });
  if (mutationData) {
    return successRenderer(mutationData);
  }

  let loading = '';
  if (fetching) loading = 'Loading...';
  mutations?.forEach((mutation) => {
    if (loading === '' && mutation.result.fetching)
      loading = mutation.loadingMessage ?? 'Loading...';
  });

  if (loading !== '') return <div className="loader">{loading}</div>;

  return renderer(data as Data);
}
