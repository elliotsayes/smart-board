import { useEffect, useRef } from 'react';
import type { TimelineItem, TimelineOptions } from 'vis-timeline/types';
import Timeline from 'react-lms-vis-timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './TimelinePicker.css'

const TimelinePicker = () => {
  const items: TimelineItem[] = [{
    id: 0,
    start: new Date(2020, 0, 0),
    content: 'Trajectory A',
    selectable: true,
    type: 'point',
  }, {
    id: 1,
    start: new Date(2023, 0, 0),
    content: 'Trajectory B',
    selectable: true,
    type: 'point',
  }]

  const nowMs = Date.now()
  const firstInteraction = items[0].start! as Date
  // const lastInteraction = (items[items.length - 1].end ?? items[items.length - 1].start) as Date
  const duration = nowMs - firstInteraction.getTime()
  const clampedDuration = Math.max(
    duration,
    1000 * 60 * 60 * 24, // 1 day
  );
  const min = new Date(firstInteraction.getTime() - clampedDuration * 0.05);
  const max = new Date(nowMs + clampedDuration * 0.05);

  const options: TimelineOptions = {
    min,
    max,
    width: '100%',
    height: '150px',
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 10000000,
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    },
    onAdd: (item) => console.log(item),
    zoomFriction: 5,
  }

  const timelineRef = useRef<Timeline>(null)

  useEffect(() => {
    setTimeout(() => {
      timelineRef.current?.timeline.redraw()
      // timelineRef.current?.forceUpdate()
      // timelineRef.current?.timeline.redraw()
    }, 100);
  }, [timelineRef])

  return (
    <div className="w-[800px] delay-75 animate-fadeIn relative">
      <div className='absolute z-50 left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-gray-900/20 bg-blend-overlay' />
      <div className='absolute z-50 right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-gray-900/20 bg-blend-overlay' />
      <Timeline
        ref={timelineRef}
        initialItems={items}
        options={options}
        currentTime={nowMs}
      />
    </div>
  )
}

export default TimelinePicker