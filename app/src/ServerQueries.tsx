import { gql, UseQueryResponse } from 'urql';

interface RenderFunction<Data> {
  // eslint-disable-next-line no-unused-vars, no-undef
  (data: Data): JSX.Element;
}

interface UseQueryProps<Data, Variables> {
  response: UseQueryResponse<Data, Variables>;
  renderer: RenderFunction<Data>;
}

export function QueryComponent<Data, Variables>(
  props: UseQueryProps<Data, Variables>
) {
  const { response, renderer } = props;
  const [{ data, fetching, error }] = response;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return renderer(data as Data);
}

export interface ImageData {
  name: string;
  tag: string;
}

export interface PortData {
  hostPort: number;
  port: string;
}

export interface VolumeData {
  name: string;
  source: string;
}

export interface ServerData {
  created: Date;
  gameVersion: string;
  id: string;
  image: ImageData;
  name: string;
  ports: PortData[];
  started: Date;
  status: string;
  type: string;
  volume: VolumeData[];
}

export interface ServerListData {
  servers: ServerData[];
}

export interface ServerInstanceData {
  server: ServerData;
}

export const GET_SERVERS = gql`
  query GetServers {
    servers {
      created
      gameVersion
      id
      image {
        name
        tag
      }
      name
      ports {
        hostPort
        port
      }
      started
      status
      type
      volumes {
        name
        source
      }
    }
  }
`;

export const GET_SERVER_BY_ID = gql`
  query GetServerById($serverId: ID!) {
    server(serverId: $serverId) {
      created
      gameVersion
      id
      image {
        name
        tag
      }
      name
      ports {
        hostPort
        port
      }
      started
      status
      type
      volumes {
        name
        source
      }
    }
  }
`;

export function formatDate(date: Date) {
  return new Date(Date.parse(date.toString())).toLocaleString('en-CA');
}
