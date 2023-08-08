import { useMachine } from "@xstate/react";
import { contractManagerMachine } from "../machines/contract_manager";
import Dashboard from "./Dashboard";
import { useCallback } from "react";
import ContractSelector from "./ContractSelector";
import DashboardBox from "./DashboardBox";

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

type ExampleContract = {
  name: string;
  address: string;
}

const exampleContracts: ExampleContract[] = [
  {
    name: "ArDrive Token",
    address: "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ",
  },
  {
    name: "ArNS Pilot",
    address: "bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U",
  },
];

interface Props {
  initialContractId?: string;
}

const ContractManager = ({ initialContractId }: Props) => {
  const [current, send] = useMachine(
    () => contractManagerMachine(initialContractId),
    { 
      // services: {
      //   loadContract: loadContractObservableFromWorker,
      // },
      devTools: import.meta.env.DEV,
    },
  );

  const onSelectFirstContract = useCallback((firstContractId: string) => {
    send({
      type: "Select First Contract",
      data: {
        firstContractId: firstContractId
      }
    })
  }, [send])

  const onNewContract = useCallback((newContractId: string) => {
    send({
      type: "Replace Contract",
      data: {
        replacementContractId: newContractId
      }
    })
  }, [send])

  if (current.context.selectedContractId === undefined) {
    return (
      <div className="flex flex-col items-center align-middle bg-gray-800/80 min-h-screen">
        <div className="my-auto w-full max-w-screen-sm">
          <DashboardBox>
            <ContractSelector 
              initialValue={""} 
              onSelect={onSelectFirstContract}
            />
          </DashboardBox>
          <div className="pt-2 pl-2">
            <span>Examples: </span>
            {
              exampleContracts.map((contractInfo) => (
                <>
                  <button 
                    key={contractInfo.address}
                    onClick={() => onSelectFirstContract(contractInfo.address)}
                    className="pl-2 text-blue-500 hover:text-blue-400 underline"
                  >
                    {contractInfo.name}
                  </button>
                </>
              ))
            }
          </div>
        </div>
      </div>
    )
  } else {
    return (
      <>
        <Dashboard
          key={current.context.selectedContractId}
          contractData={current.context.contractData}
          onNewContract={onNewContract}
        />
      </>
    )
  }
}

export default ContractManager
