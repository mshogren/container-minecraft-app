import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AnyVariables,
  CombinedError,
  UseMutationState,
  UseQueryResponse,
} from 'urql';
import { ServerError } from './ServerQueries';

interface RenderFunction<Data> {
  (data: Data): ReactElement;
}

interface GraphQLHookConfiguration<Data> {
  loadingMessage?: string;
  loadingRenderer?: RenderFunction<Data>;
  onErrorClick?: () => void;
  successRenderer?: RenderFunction<Data>;
}

export interface QueryConfiguration<
  Data,
  Variables extends AnyVariables,
> extends GraphQLHookConfiguration<Data> {
  response: UseQueryResponse<Data, Variables>;
  successRenderer: RenderFunction<Data>;
}

export interface MutationConfiguration extends GraphQLHookConfiguration<never> {
  result: UseMutationState;
  onErrorClick: () => void;
  successRenderer?: RenderFunction<never>;
}

export interface GraphQLComponentProps<Data, Variables extends AnyVariables> {
  content: QueryConfiguration<Data, Variables> | ReactElement;
  mutations?: MutationConfiguration[];
}

export function EmptyMutationState<Data, Variables extends AnyVariables>() {
  return {
    data: undefined,
    error: undefined,
    fetching: false,
    stale: false,
  } as UseMutationState<Data, Variables>;
}

export function GraphQLComponent<Data, Variables extends AnyVariables>(
  props: GraphQLComponentProps<Data, Variables>
) {
  const { content, mutations } = props;
  const { response, onErrorClick, successRenderer } =
    'response' in content
      ? (content as QueryConfiguration<Data, Variables>)
      : {
          response: undefined,
          onErrorClick: undefined,
          successRenderer: undefined,
        };
  const [{ data, fetching, error }] = response ?? [
    {
      data: undefined,
      fetching: false,
      error: undefined,
    },
  ];

  const navigate = useNavigate();

  let clickHandler = onErrorClick;
  let errorState = error;
  mutations?.forEach((mutation) => {
    if (!errorState) {
      errorState = errorState || mutation.result.error;
      if (errorState) clickHandler = mutation.onErrorClick;
    }
    if (!errorState && mutation.result.data) {
      const apiError = Object.values(mutation.result.data)[0] as ServerError;
      if (apiError.error) {
        errorState = new CombinedError({ graphQLErrors: [apiError.error] });
        clickHandler = mutation.onErrorClick;
      }
    }
  });

  if (errorState) {
    const handleClick = () => {
      if (clickHandler) clickHandler();
      else navigate('/');
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
  let mutationRenderer: RenderFunction<never> | undefined;

  mutations?.forEach((mutation) => {
    if (mutation.result.data) {
      mutationData = mutation.result.data;
      mutationRenderer = mutation.successRenderer;
    }
  });
  if (mutationData && mutationRenderer) {
    return mutationRenderer(mutationData);
  }

  let loadingRenderer: RenderFunction<never> | undefined;
  let loading = '';
  if (fetching) loading = 'Loading...';
  mutations?.forEach((mutation) => {
    if (loading === '' && mutation.result.fetching) {
      loadingRenderer = mutation.loadingRenderer;
      loading = mutation.loadingMessage ?? 'Loading...';
    }
  });

  if (loadingRenderer && data) return loadingRenderer(data as never);
  if (loading !== '') return <div className="loader">{loading}</div>;

  if (successRenderer) return successRenderer(data as Data);
  return content as ReactElement;
}
