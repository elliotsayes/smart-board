import './App.css'
import TimelinePicker from './components/TimelinePicker'
// import TimelineTest from './components/TimelineTest'

const items10k = Array.from({ length: 1_000 }, (_, i) => ({
  id: i,
  start: new Date(1800 + Math.floor(i / (12 * 28)), (i * 28) % (12), 1 + i % 28),
  content: "",
  selectable: true,
  type: "point",
}));

function App() {
  return (
    <div>
      <TimelinePicker
        items={items10k}
        onSelect={(i) => console.log('Selected', i)}
        onDeselect={() => console.log('Deselected')}
      />
    </div>
  )
}

export default App
