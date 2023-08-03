import { useMachine } from "@xstate/react";
import { contractManagerMachine } from "../machines/contract_manager";

// import { fromWorker } from 'observable-webworker';
// import { of } from 'rxjs';
// import { map } from 'rxjs/operators';
// import ContractLoadWorker from '../services/contract_load_worker?worker';
// const loadContractObservableFromWorker = (context) => (send) => {
//   fromWorker(
//     () => new ContractLoadWorker(),
//     of(context.selectedContractId!),
//   ).pipe(
//     map((x) => {
//       console.log(x)
//       return {
//         type: "Data Available",
//         data: x,
//       }
//     }
//   )).subscribe(event => send(event))
// };

interface Props {
  initialContractId?: string;
}

const ContractManager = (props: Props) => {
  const { initialContractId } = props;

  const [current] = useMachine(
    () => contractManagerMachine(initialContractId), 
    { devTools: true },
  );

  return (
    <>
      <div>{JSON.stringify(current.value)}</div>
      <pre>Interactions: {current.context.contractData.interactionHistory?.length.toString()}</pre>
      <pre>States: {current.context.contractData.stateHistory?.length.toString()}</pre>
    </>
  )
}

export default ContractManager
