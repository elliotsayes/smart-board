import { useEffect, useMemo, useRef, useState } from 'react';
import { Timeline, type TimelineItem, type TimelineOptions } from 'vis-timeline/esnext';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './TimelinePicker.css'

interface Props {
  items: TimelineItem[],
  onSelect?: (item?: number) => void,
  onDeselect?: () => void,
}

const TimelinePicker = (props: Props) => {
  const { items, onSelect, onDeselect } = props;

  const options: TimelineOptions = useMemo(() => {
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
    return {
      min,
      max,
      stack: false,
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
  }, [items]);

  const timelineDivRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(false);
  const setupRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTimeline] = useState<Timeline | null>(null)

  useEffect(() => {
    if (loadRef.current || setupRef.current) {
      console.log('returning')
      return
    }
    loadRef.current = true;
    console.log('setting up')

    const timeline = new Timeline(timelineDivRef.current!, items, options)
    type SelectProperties = {
      items: number[];
    }
    timeline.on('select', (properties: SelectProperties) => {
      if (properties.items.length === 0) {
        onDeselect?.()
      } else {
        onSelect?.(properties.items[0])
      }
    })
    timeline.fit()
    // timeline.getVisibleItems()
    setTimeline(timeline)
    // timeline.zoomOut(1)
    // timeline.redraw()
    
    console.log('setup complete')
    setupRef.current = true;
    loadRef.current = false;

    return () => {
      console.log('destroying')
      timeline.off('select')
      timeline.destroy()
      setupRef.current = false
    }
  }, [items, options, onSelect, onDeselect])

  return (
    <div className="w-[1000px] delay-75 animate-fadeIn relative">
      <div className='absolute z-50 left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div className='absolute z-50 right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div ref={timelineDivRef} />
    </div>
  )
}

export default TimelinePicker