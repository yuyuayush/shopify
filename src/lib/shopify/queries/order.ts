export const getOrderQuery = /* GraphQL */ `
  query getOrder($id: ID!) {
    node(id: $id) {
      ... on Order {
        id
        name
        orderNumber
        processedAt
        financialStatus
        fulfillmentStatus
        statusUrl
        totalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        shippingAddress {
          address1
          address2
          city
          province
          country
          zip
        }
        lineItems(first: 20) {
          edges {
            node {
              title
              quantity
              originalTotalPrice {
                amount
                currencyCode
              }
              variant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                image {
                  url
                  altText
                }
              }
            }
          }
        }
        successfulFulfillments(first: 10) {
          trackingCompany
          trackingInfo(first: 5) {
            number
            url
          }
        }
      }
    }
  }
`;
