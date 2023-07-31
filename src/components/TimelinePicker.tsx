import { useEffect, useMemo, useRef, useState } from 'react';
import { throttle } from 'throttle-debounce'
import { IdType, Timeline, type TimelineItem, type TimelineOptions } from 'vis-timeline/esnext';
import Moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './TimelinePicker.css'

const MAX_ITEMS = 500;

interface Props {
  items: TimelineItem[],
  // line?: Date,
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
      // TODO: Check that this is correct
      moment: function (date: Moment.MomentInput) {
        return Moment(date).utc();
      },
    }
  }, [items]);

  const timelineDivRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(false);
  const setupRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setTimeline] = useState<Timeline | undefined>()

  const itemsSampled = useMemo(() => {
    console.log('sampling items')
    const itemCount = items.length
    if (itemCount <= MAX_ITEMS) return items;
    const globalRatio = itemCount / MAX_ITEMS
    return items.filter((_, i) => i % Math.ceil(globalRatio) === 0)
  }, [items])

  useEffect(() => {
    if (loadRef.current || setupRef.current) {
      console.log('returning')
      return
    }
    loadRef.current = true;
    console.log('setting up')

    const timeline = new Timeline(timelineDivRef.current!, [], options)

    type SelectProperties = {
      items: number[];
    }
    timeline.on('select', (properties: SelectProperties) => {
      if (properties.items.length === 0) {
        onDeselect?.()
      } else {
        const item = properties.items[0]
        onSelect?.(item)
      }
    })

    type RangeChangedProperties = {
      start: Date,
      end: Date,
      byUser: boolean,
    }
    const trimRange = (properties: RangeChangedProperties) => {
      // console.log('trimming range', properties)
      const { start, end, byUser } = properties;

      const beforeRangeItemsSampled = itemsSampled.filter((item) => (item.start as Date).getTime() < start.getTime());
      const afterRangeItemsSampled = itemsSampled.filter((item) => (item.start as Date).getTime() > end.getTime());
      
      const inRangeItems = items.filter((item) => {
        const itemStartTime = (item.start as Date).getTime()
        return itemStartTime >= start.getTime() && itemStartTime <= end.getTime();
      });
      const inRangeCount = inRangeItems.length;

      const selection = timeline.getSelection()[0] as IdType | undefined;
      let renderItems: TimelineItem[];
      if (inRangeCount > MAX_ITEMS) {
        const inRangeRatio = inRangeCount / MAX_ITEMS
        const filteredItems = inRangeItems.filter((item, i) => ((i % Math.ceil(inRangeRatio) === 0) || item.id == selection))
        renderItems = [...beforeRangeItemsSampled, ...filteredItems, ...afterRangeItemsSampled]
        console.log('filtered items', renderItems.length, inRangeCount)
      } else {
        renderItems = [...beforeRangeItemsSampled, ...inRangeItems, ...afterRangeItemsSampled]
        console.log('all items', renderItems.length, inRangeCount)
      }
      timeline.setItems(renderItems)
      selection && timeline.setSelection([selection]) // Workaround for losing selection
    }
    trimRange({
      start: options.min as Date,
      end: options.max as Date,
      byUser: false,
    })
    timeline.fit()
    // timeline.on('rangechanged', trimRange)
    timeline.on('rangechange', throttle(250, trimRange, { noLeading: true, noTrailing: false }))
    setTimeline(timeline)
    
    console.log('setup complete')
    setupRef.current = true;
    loadRef.current = false;

    return () => {
      console.log('destroying')
      timeline.off('rangechange')
      timeline.off('select')
      timeline.destroy()
      setupRef.current = false
    }
  }, [items, itemsSampled, options, onSelect, onDeselect])

  return (
    <div className="w-[1000px] animate-fade-in relative">
      <div className='absolute z-50 left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div className='absolute z-50 right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div ref={timelineDivRef} />
    </div>
  )
}

export default TimelinePicker