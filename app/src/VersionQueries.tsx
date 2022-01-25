import { gql } from 'urql';

export interface VersionListData {
  versions: string[];
}

export const GET_VERSIONS = gql`
  query GetVersions {
    versions
  }
`;
