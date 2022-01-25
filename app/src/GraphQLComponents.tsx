import { UseQueryState } from 'urql';

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

export function MutationComponent() {
  return <div />;
}
