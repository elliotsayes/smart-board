import { inspect } from '@xstate/inspect'
if (import.meta.env.DEV) {
  inspect({
    iframe: false,
  });
}
import './App.css'
import ContractManager from './components/ContractManager';
// import MouseTester from './components/MouseTester';

function App() {
  return (
    <div>
      <ContractManager initialContractId='aeQgDoPgdixT7tjNXC9X4x6NRjGjAmsvUndl3_EHlto' />
    </div>
  )
}

export default App
