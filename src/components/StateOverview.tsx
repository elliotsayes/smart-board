import { ContractState } from "../types/contract"

interface Props {
  initialState: ContractState;
  latestState?: ContractState;
}

const StateOverview = ({initialState, latestState}: Props) => {
  return (
    <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <div className="rounded-lg bg-code-pen">
        <h1 className="p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]">Initial State</h1>
        <pre className="text-sm max-h-72 w-96 overflow-scroll">
          {JSON.stringify(initialState.cachedValue.state, undefined, 2)}
        </pre>
      </div>
      <div className="rounded-lg bg-code-pen">
        <h1 className="p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]">Latest State</h1>
        {
          latestState !== undefined ? (
            <pre className="text-sm max-h-72 w-96 overflow-auto">
              {JSON.stringify(latestState.cachedValue.state, undefined, 2)}
            </pre>
          ) : (
            <p>Loading...</p>
          )
        }
      </div>
    </div>
  )
}

export default StateOverview