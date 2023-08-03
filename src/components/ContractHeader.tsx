import { ContractMeta } from "../types/contract"

type Props = ContractMeta

const ContractHeader = ({owner, txId, srcTxId, contractType, src}: Props) => {
  return (
    <div>
      <h1>Contract</h1>
      <p>owner: {owner}</p>
      <p>txId: {txId}</p>
      <p>srcTxId: {srcTxId}</p>
      <p>contractType: {contractType}</p>
      {/* <p>src: </p><pre>{src}</pre> */}
    </div>
  )
}

export default ContractHeader
