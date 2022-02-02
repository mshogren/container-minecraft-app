import { gql, useQuery, UseQueryArgs } from 'urql';

export interface ModpackData {
  categories: string[];
  downloadCount: number;
  id: string;
  name: string;
  summary: string;
  thumbnailUrl: string;
}

export interface ModpackListData {
  modpacks: ModpackData[];
}

export interface ModpackInstanceData {
  modpack: ModpackData;
}

export const GET_MODPACKS = gql`
  query GetModpacks($search: String, $page: Int) {
    modpacks(search: $search, page: $page) {
      categories
      downloadCount
      id
      name
      summary
      thumbnailUrl
    }
  }
`;

export const useGetModpacksQuery = (args?: UseQueryArgs) => {
  return useQuery<ModpackListData>({
    ...args,
    query: GET_MODPACKS,
  });
};
