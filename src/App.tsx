const __DEV__ = import.meta.env.DEV

import { inspect } from '@xstate/inspect'
if (__DEV__) {
  inspect({
    iframe: false,
  });
}
import './App.css'
import ContractManager from './components/ContractManager';
import queryString from 'query-string';

// Example contracts
const quiet = 'aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto'
// const med = 'bLAgYxAdX2Ry-nt6aH2ixgvJXbpsEYm28NgJgyqfs-U'
// const busy = '-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ'

const searchQuery = queryString.parse(window.location.search)
const searchQueryContractId = typeof searchQuery.contractId === 'string' ? searchQuery.contractId : undefined

const initialContractId = searchQueryContractId;

function App() {
  return (
    <div>
      <ContractManager 
        initialContractId={initialContractId} 
      />
    </div>
  )
}

export default App
