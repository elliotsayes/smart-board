import { TimelineItem } from 'vis-timeline';
import './App.css'
import TimelinePicker from './components/TimelinePicker'
import { ardrive } from './fixtures/timestamps';
// import TimelineTest from './components/TimelineTest'

const itemsArdrive: TimelineItem[] = ardrive.map((ts, i) => ({
  id: i,
  start: new Date(ts * 1000),
  content: "",
  selectable: true,
  type: "point",
}));

function App() {
  return (
    <div>
      <TimelinePicker
        items={itemsArdrive}
        onSelect={(i) => console.log('Selected', i)}
        onDeselect={() => console.log('Deselected')}
      />
    </div>
  )
}

export default App
