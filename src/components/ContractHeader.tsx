import { ContractMeta } from "../types/contract"
import HashView from "./HashView"
import Identicon from "./Identicon"

type Props = ContractMeta

const ContractHeader = ({owner, srcTxId, contractType}: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 align-middle p-2">
      <div className="flex">
        <Identicon address={owner} />
        <div>
          <p className="text-sm font-semibold pl-2 pb-0.5">
            Creator
          </p>
          <HashView hash={owner} viewblock="address" warpSonar="creator" />
        </div>
      </div>
      {/* <p>TxId <HashView hash={txId} viewblock="tx" warpSonar="contract" /></p> */}
      <div>
        <p className="text-sm font-semibold pl-2 pb-0.5">
          Source{` `}
          <span className={` align-text-top font-mono text-xs rounded-sm px-0.5 ${contractType === 'js' ? 'bg-yellow-400/40' : 'bg-purple-400/40'}`}>
            {contractType.toLocaleUpperCase()}
          </span>
        </p>
        <HashView hash={srcTxId} viewblock="tx" warpSonar="source" />
      </div>
      <div className="flex items-center">
        
      </div>
      {/* <p>src: </p><pre>{src}</pre> */}
    </div>
  )
}

export default ContractHeader
