import { gql } from 'urql';

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

export interface AddServerSuccess {
  server: ServerData;
}

export interface AddServerError {
  error: string;
}

export interface AddVanillaServer {
  addVanillaServer: AddServerSuccess | AddServerError;
}

export interface AddVanillaServerInput {
  name: string;
  version: string;
}

export interface AddCurseforgeServer {
  addCurseforgeServer: AddServerSuccess | AddServerError;
}

export interface AddCurseforgeServerInput {
  name: string;
  modpack: string;
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

export const ADD_VANILLA_SERVER = gql`
  mutation AddVanillaServer($name: String!, $version: String!) {
    addVanillaServer(server: { name: $name, version: $version }) {
      ... on AddServerSuccess {
        server {
          id
        }
      }
      ... on AddServerError {
        error
      }
    }
  }
`;

export const ADD_CURSEFORGE_SERVER = gql`
  mutation AddCurseforgeServer($name: String!, $modpack: String!) {
    addCurseforgeServer(server: { modpackId: $modpack, name: $name }) {
      ... on AddServerSuccess {
        server {
          id
        }
      }
      ... on AddServerError {
        error
      }
    }
  }
`;
