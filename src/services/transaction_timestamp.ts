export const transactionTimestamp = async (
  txId: string,
  endpoint = "https://arweave.net/graphql"
) => {
  return await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          transaction(id: "${txId}") {
            block {
              timestamp
            }
          }
        }
      `,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.transaction.block.timestamp as number);
};
