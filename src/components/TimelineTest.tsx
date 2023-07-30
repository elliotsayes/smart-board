import { useEffect, useRef, useState } from 'react'
import { DataSetDataItem, DataGroupCollectionType, DataItemCollectionType, Timeline, TimelineOptions, DataSet } from 'vis-timeline/standalone'
import 'vis-timeline/styles/vis-timeline-graph2d.css'

// interface Props {
//   items: DataItemCollectionType
//   groups: DataGroupCollectionType
//   options?: TimelineOptions
// }

const items = new DataSet([
  {
    "id": 1,
    "content": "item 1",
    "start": "2014-01-01T01:00:00"
  },
  {
    "id": 4,
    "content": "item 4",
    "start": "2014-01-01T04:00:00",
    "end": "2014-01-01T04:30:00"
  },
  {
    "id": 5,
    "content": "item 5",
    "start": "2014-01-01T05:00:00",
    "type": "point"
  },
  {
    "id": 6,
    "content": "item 6",
    "start": "2014-01-01T06:00:00"
  }
])
const options = {
  height: '500px'
}

const TimelineTest = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(false);
  const setupRef = useRef(false);

  const [_, setTimeline] = useState<Timeline | null>(null)

  useEffect(() => {
    if (loadRef.current || setupRef.current) {
      console.log('returning')
      return
    }
    loadRef.current = true;
    console.log('setting up')

    const timeline = new Timeline(divRef.current!, items, options)
    timeline.fit()
    setTimeline(timeline)
    // timeline.zoomOut(1)
    // timeline.redraw()
    
    console.log('setup complete')
    setupRef.current = true;
    loadRef.current = false;

    return () => {
      console.log('destroying')
      timeline.destroy();
      setupRef.current = false;
    }
  }, [])

  return (
    <div ref={divRef} className='' />
  )
}

export default TimelineTest;