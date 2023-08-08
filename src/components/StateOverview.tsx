import { ContractState } from "../types/contract"
import CopyCodeButton from "./CopyCodeButton";
import PrismPreJson from "./PrismPreJson";

interface Props {
  initialState: ContractState;
  latestState?: ContractState;
}

const StateOverview = ({initialState, latestState}: Props) => {
  return (
    <div className="gap-x-8 gap-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 p-2">
      <div className="rounded-lg bg-code-pen overflow-hidden">
        <div className="flex flex-row flex-grow justify-between p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]">
          <p>Initial State</p>
          <CopyCodeButton key="initialstate" copyText={JSON.stringify(initialState.cachedValue.state)} />
        </div>
        <div className="text-sm max-h-72 w-96 overflow-auto p-2">
          <PrismPreJson str={JSON.stringify(initialState.cachedValue.state, undefined, 2)} />
        </div>
      </div>
      <div className="rounded-lg bg-code-pen">
        <div className="flex flex-row flex-grow justify-between p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]">
          <p>Latest State</p>
          <CopyCodeButton key="lateststate" copyText={JSON.stringify(latestState?.cachedValue.state)} />
        </div>
        {
          latestState !== undefined ? (
            <div className="text-sm max-h-72 w-96 overflow-auto p-2">
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