import { useMachine } from "@xstate/react";
import { contractManagerMachine } from "../machines/contract_manager";
import { useCallback, lazy, Suspense } from "react";
import ContractSelector from "./ContractSelector";
import DashboardBox from "./DashboardBox";
// convert to dynamic import
// import Dashboard from "./Dashboard";
const Dashboard = lazy(() => import("./Dashboard"));

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
    name: "ANT-COMMUNITY (~20)",
    address: "39lHRvtS8TDbODiIoKCHM9AXmrCgTBuYn116tGfCCEI",
  },
  {
    name: "$ARDRIVE (~8000)",
    address: "-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ",
  },
  {
    name: "ArNS Pilot (~2000)",
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
      <div className="flex flex-col items-center align-middle min-h-screen">
        <div className="my-auto w-full max-w-screen-sm px-4 items-center">
          <img src="./smartboard.svg" className="w-full mx-auto" />
          <div className="pt-4 pb-2">
            <DashboardBox>
              <ContractSelector 
                initialValue={""} 
                onSelect={onSelectFirstContract}
              />
            </DashboardBox>
          </div>
          <div className="pl-2">
            <p>Enter a contract id get started, or try an example: </p>
            {
              exampleContracts.map((contractInfo) => (
                <>
                  <a 
                    key={contractInfo.address}
                    href={`?contractId=${contractInfo.address}`}
                    className="pr-1 underline"
                  >
                    {contractInfo.name}
                  </a>
                </>
              ))
            }
          </div>
        </div>
        {/* Render hidden straight away */}
        <Suspense fallback={null}>
          <div hidden={true}>
            <Dashboard 
              contractData={{}}
              onNewContract={() => {}} 
            />
          </div>
        </Suspense>
      </div>
    )
  } else {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard
          key={current.context.selectedContractId}
          contractData={current.context.contractData}
          onNewContract={onNewContract}
        />
      </Suspense>
    )
  }
}

export default ContractManager
