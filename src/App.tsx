const __DEV__ = false// import.meta.env.DEV

import { inspect } from '@xstate/inspect'
if (__DEV__) {
  inspect({
    iframe: false,
  });
}
import './App.css'
import ContractManager from './components/ContractManager';
// import MouseTester from './components/MouseTester';

const quiet = 'aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto'
const busy = '-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ'
const contractId = __DEV__ ? quiet : busy;

function App() {
  return (
    <div>
      <ContractManager initialContractId={contractId} />
    </div>
  )
}

export default App
