import './App.css'
import ContractManager from './components/ContractManager';
import MouseTester from './components/MouseTester';

function App() {
  return (
    <div>
      <MouseTester />
      <ContractManager initialContractId='-8A6RexFkpfWwuyVO98wzSFZh0d6VJuI-buTJvlwOJQ' />
    </div>
  )
}

export default App
