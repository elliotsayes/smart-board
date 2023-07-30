import type { TimelineItem, TimelineOptions } from 'vis-timeline/types';
import Timeline from 'react-lms-vis-timeline';
import { useEffect, useRef } from 'react';

const TimelinePicker = () => {
  const items: TimelineItem[] = [{
    id: 0,
    start: new Date(2010, 0, 0),
    content: 'Trajectory A',
    selectable: true,
    type: 'point',
  }, {
    id: 1,
    start: new Date(2020, 0, 0),
    content: 'Trajectory B',
    selectable: true,
    type: 'point',
  }]

  // Difference between js Date()s
  const firstInteraction = items[0].start! as Date
  const lastInteraction = (items[items.length - 1].end ?? items[items.length - 1].start) as Date
  const duration = lastInteraction.getTime() - firstInteraction.getTime()
  const clampedDuration = Math.max(
    duration,
    1000 * 60 * 60 * 24, // 1 day
  );
  const min = new Date(firstInteraction.getTime() - clampedDuration * 0.05);
  const max = new Date(Date.now() + clampedDuration * 0.05);

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
    onAdd: (item) => console.log(item)
  }

  const timelineRef = useRef<Timeline>(null)

  useEffect(() => {
    setTimeout(() => {
      // timelineRef.current?.forceUpdate()
      timelineRef.current?.timeline.redraw()
      // timelineRef.current?.timeline.fit()
    }, 0);
  }, [timelineRef])

  return (
    <div className={`w-[800px] delay-75 animate-fadeIn`}>
      <Timeline
        ref={timelineRef}
        initialItems={items}
        options={options}
      />
    </div>
  )
}

export default TimelinePicker