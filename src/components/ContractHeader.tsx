import { ContractMeta } from "../types/contract"
import HashView from "./HashView"

type Props = ContractMeta

const ContractHeader = ({owner, txId, srcTxId, contractType}: Props) => {
  return (
    <div>
      <p>Creator: <HashView hash={owner} viewblock="address" warpSonar="creator" /></p>
      <p>TxId: <HashView hash={txId} viewblock="tx" warpSonar="contract" /></p>
      <p>srcTxId: <HashView hash={srcTxId} viewblock="tx" warpSonar="source" /></p>
      <p>contractType: {contractType}</p>
      {/* <p>src: </p><pre>{src}</pre> */}
    </div>
  )
}

export default ContractHeader
