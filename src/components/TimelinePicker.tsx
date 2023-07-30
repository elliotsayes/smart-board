import type { TimelineItem, TimelineOptions } from 'vis-timeline/types';
import Timeline from 'react-lms-vis-timeline';

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
  const min = new Date(firstInteraction.getTime() - clampedDuration * 0.02);
  const max = new Date(lastInteraction.getTime() + clampedDuration * 0.02);

  const options: TimelineOptions = {
    min,
    max,
    width: '100%',
    // height: '60px',
    // stack: false,
    showMajorLabels: true,
    showCurrentTime: true,
    zoomMin: 10000000,
    // type: 'background',
    format: {
      minorLabels: {
        minute: 'h:mma',
        hour: 'ha'
      }
    }
  }

  return (
    <div className='w-[800px]'>
      <Timeline
        initialItems={items}
        currentTime={Date.now()}
        options={options}
      />
    </div>
  )
}

export default TimelinePicker