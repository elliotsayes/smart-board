import { ContractDefinition } from 'warp-contracts';

type Props = Pick<
  ContractDefinition<unknown>, 
  'owner' |
  'txId' | 
  'srcTxId' |
  'contractType' | 
  'src'
>

const ContractHeader = ({txId, srcTxId, contractType, src}: Props) => {
  return (
    <div>
      <h1>Contract</h1>
      <p>txId: {txId}</p>
      <p>srcTxId: {srcTxId}</p>
      <p>contractType: {contractType}</p>
      <p>src: {src}</p>
    </div>
  )
}

export default ContractHeader
