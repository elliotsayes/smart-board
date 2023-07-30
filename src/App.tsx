import './App.css'
import TimelinePicker from './components/TimelinePicker'
// import TimelineTest from './components/TimelineTest'

function App() {
  return (
    <div>
      <TimelinePicker
        onSelect={(i) => console.log('Selected', i)}
        onDeselect={() => console.log('Deselected')}
      />
    </div>
  )
}

export default App
