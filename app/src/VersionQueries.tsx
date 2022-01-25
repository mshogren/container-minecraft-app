import { gql, useQuery, UseQueryArgs } from 'urql';

export interface VersionListData {
  versions: string[];
}

export const GET_VERSIONS = gql`
  query GetVersions {
    versions
  }
`;

export const useGetVersionsQuery = (args?: UseQueryArgs) => {
  return useQuery<VersionListData>({
    ...args,
    query: GET_VERSIONS,
  });
};
