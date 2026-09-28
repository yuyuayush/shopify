export const pageFragment = /* GraphQL */ `
  fragment page on Page {
    id
    title
    handle
    body
    bodySummary
    seo {
      title
      description
    }
    createdAt
    updatedAt
  }
`;

export const getPageQuery = /* GraphQL */ `
  query getPage($handle: String!) {
    pageByHandle(handle: $handle) {
      ...page
    }
  }
  ${pageFragment}
`;

export const getPagesQuery = /* GraphQL */ `
  query getPages {
    pages(first: 100) {
      edges {
        node {
          ...page
        }
      }
    }
  }
  ${pageFragment}
`;
