import { gql, useQuery, UseQueryArgs } from 'urql';

export interface ModpackData {
  id: string;
  name: string;
}

export interface ModpackListData {
  modpacks: ModpackData[];
}

export interface ModpackInstanceData {
  modpack: ModpackData;
}

export const GET_MODPACKS = gql`
  query GetModpacks {
    modpacks {
      id
      name
    }
  }
`;

export const useGetModpacksQuery = (args?: UseQueryArgs) => {
  return useQuery<ModpackListData>({
    ...args,
    query: GET_MODPACKS,
  });
};
