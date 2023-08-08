import { ContractState } from "../types/contract"
import PrismPreJson from "./PrismPreJson";

interface Props {
  initialState: ContractState;
  latestState?: ContractState;
}

const StateOverview = ({initialState, latestState}: Props) => {
  return (
    <div className="flex">
      <div className="flex flex-grow flex-col">
        <h1>Initial State</h1>
        <div className="text-sm max-h-72 w-96 overflow-auto">
          <PrismPreJson str={JSON.stringify(initialState.cachedValue.state, undefined, 2)} />
        </div>
      </div>
      <div className="flex flex-grow flex-col">
        <h1>Latest State</h1>
        {
          latestState !== undefined ? (
            <div className="text-sm max-h-72 w-96 overflow-auto">
              <PrismPreJson str={JSON.stringify(latestState.cachedValue.state, undefined, 2)} />
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