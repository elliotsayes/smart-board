import { useMachine } from "@xstate/react";
import { contractManagerMachine } from "../machines/contract_manager";
import Dashboard from "./Dashboard";
import { useCallback } from "react";

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

const ContractManager = ({ initialContractId }: Props) => {
  const [current, send] = useMachine(
    () => contractManagerMachine(initialContractId), 
    { 
      devTools: import.meta.env.DEV,
    },
  );

  const onNewContract = useCallback((newContractId: string) => {
    send({
      type: "Replace Contract",
      data: {
        replacementContractId: newContractId
      }
    })
  }, [send])

  return (
    <>
      <Dashboard
        contractData={current.context.contractData}
        onNewContract={onNewContract}      />
    </>
  )
}

export default ContractManager
