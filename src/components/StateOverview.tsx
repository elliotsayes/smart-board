import { ContractState } from "../types/contract"
import PrismPreJson from "./PrismPreJson";

interface Props {
  initialState: ContractState;
  latestState?: ContractState;
}

const StateOverview = ({initialState, latestState}: Props) => {
  const intitialStateObject = initialState.cachedValue.state as object;
  const latestStateObject = latestState?.cachedValue.state as object;

  return (
    <div className="flex flex-col lg:flex-row justify-evenly shrink gap-4">
      <div className="flex flex-col shrink">
        <h1 className=" text-gray-200/80 text-lg">Initial State</h1>
        <div className="text-sm max-h-72 overflow-scroll">
          <PrismPreJson str={JSON.stringify(intitialStateObject, undefined, 2)} />
        </div>
      </div>
      <div className="flex flex-col shrink">
        <h1 className="text-gray-200/80 text-lg">Latest State</h1>
        {
          latestState !== undefined ? (
            <div className="text-sm max-h-72 overflow-scroll">
              <PrismPreJson str={JSON.stringify(latestStateObject, undefined, 2)} />
            </div>
          ) : (
            <p>Loading...</p>
          )
        }
      </div>
    </div>
  )
}

export default StateOverview