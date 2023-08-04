import { ContractMeta } from "../types/contract"
import HashView from "./HashView"
import Identicon from "./Identicon"

type Props = ContractMeta

const ContractHeader = ({owner, srcTxId, contractType}: Props) => {
  return (
    <div className="flex gap-4 align-middle">
      <Identicon address={owner} />
      <div/>
      <p>Creator <HashView hash={owner} viewblock="address" warpSonar="creator" /></p>
      {/* <p>TxId <HashView hash={txId} viewblock="tx" warpSonar="contract" /></p> */}
      <p>Source <HashView hash={srcTxId} viewblock="tx" warpSonar="source" /></p>
      <div className="flex items-center">
        <code className="bg-gray-100/40 px-2 py-1 rounded-md">{contractType.toLocaleUpperCase()}</code>
      </div>
      {/* <p>src: </p><pre>{src}</pre> */}
    </div>
  )
}

export default ContractHeader
