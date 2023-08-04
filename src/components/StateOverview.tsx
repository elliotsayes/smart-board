import { ContractState } from "../types/contract"

interface Props {
  initialState: ContractState;
  latestState?: ContractState;
}

const StateOverview = ({initialState, latestState}: Props) => {
  return (
    <div className="flex">
      <div className="flex flex-grow flex-col">
        <h1>Initial State</h1>
        <pre className="text-sm max-h-72 overflow-auto">
          {JSON.stringify(initialState.cachedValue.state, undefined, 2)}
        </pre>
      </div>
      <div className="flex flex-grow flex-col">
        <h1>Latest State</h1>
        {
          latestState !== undefined ? (
            <pre className="text-sm max-h-72 overflow-auto">
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