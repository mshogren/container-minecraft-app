import { gql, useMutation, useQuery, UseQueryArgs } from 'urql';

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

export interface ServerSuccess {
  server: ServerData;
}

export interface ServerError {
  error: string;
}

export interface AddVanillaServer {
  addVanillaServer: ServerSuccess | ServerError;
}

export interface AddVanillaServerInput {
  name: string;
  version: string;
}

export interface AddCurseforgeServer {
  addCurseforgeServer: ServerSuccess | ServerError;
}

export interface AddCurseforgeServerInput {
  name: string;
  modpack: string;
}

export interface ServerIdInput {
  serverId: string;
}

export interface StartServer {
  startServer: ServerSuccess | ServerError;
}

export interface StopServer {
  startServer: ServerSuccess | ServerError;
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

export const useGetServersQuery = (args?: UseQueryArgs) => {
  return useQuery<ServerListData>({
    ...args,
    query: GET_SERVERS,
  });
};

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

export const useGetServerByIdQuery = (args?: UseQueryArgs) => {
  return useQuery<ServerInstanceData>({
    ...args,
    query: GET_SERVER_BY_ID,
  });
};

export const ADD_VANILLA_SERVER = gql`
  mutation AddVanillaServer($name: String!, $version: String!) {
    addVanillaServer(server: { name: $name, version: $version }) {
      ... on ServerSuccess {
        server {
          id
        }
      }
      ... on ServerError {
        error
      }
    }
  }
`;

export const useAddVanillaServerMutation = () => {
  return useMutation<AddVanillaServer, AddVanillaServerInput>(
    ADD_VANILLA_SERVER
  );
};

export const ADD_CURSEFORGE_SERVER = gql`
  mutation AddCurseforgeServer($name: String!, $modpack: String!) {
    addCurseforgeServer(server: { modpackId: $modpack, name: $name }) {
      ... on ServerSuccess {
        server {
          id
        }
      }
      ... on ServerError {
        error
      }
    }
  }
`;

export const useAddCurseServerMutation = () => {
  return useMutation<AddCurseforgeServer, AddCurseforgeServerInput>(
    ADD_CURSEFORGE_SERVER
  );
};

export const START_SERVER = gql`
  mutation StartServer($serverId: ID!) {
    startServer(serverId: $serverId) {
      ... on ServerSuccess {
        server {
          id
        }
      }
      ... on ServerError {
        error
      }
    }
  }
`;

export const useStartServerMutation = () => {
  return useMutation<StartServer, ServerIdInput>(START_SERVER);
};

export const STOP_SERVER = gql`
  mutation StopServer($serverId: ID!) {
    stopServer(serverId: $serverId) {
      ... on ServerSuccess {
        server {
          id
        }
      }
      ... on ServerError {
        error
      }
    }
  }
`;

export const useStopServerMutation = () => {
  return useMutation<StopServer, ServerIdInput>(STOP_SERVER);
};
