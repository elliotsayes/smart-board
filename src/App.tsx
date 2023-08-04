import { inspect } from '@xstate/inspect'
if (import.meta.env.DEV) {
  inspect({
    iframe: false,
  });
}
import './App.css'
import ContractManager from './components/ContractManager';
// import MouseTester from './components/MouseTester';

const quiet = 'aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto'
// const busy = '-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ'

function App() {
  return (
    <div>
      <ContractManager initialContractId={quiet} />
    </div>
  )
}

export default App
