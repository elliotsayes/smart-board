import { useEffect, useMemo, useRef } from 'react';
import { throttle } from 'throttle-debounce'
import { DateType, IdType, Timeline, type TimelineItem, type TimelineOptions } from 'vis-timeline/esnext';
import { utcMs } from '../utils/time';
import Moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './TimelinePicker.css'

const MAX_ITEMS = 500;

interface Props {
  items: TimelineItem[],
  // line?: Date,
  onTimeline?: (timeline: Timeline) => void,
  onSelect?: (item?: number) => void,
  onRangeChanged?: (range: [number, number]) => void,
}

const TimelinePicker = (props: Props) => {
  const { items, onTimeline, onSelect, onRangeChanged } = props;

  const options: TimelineOptions = useMemo(() => {
    const nowMs = Date.now()
    const firstInteractionMs = utcMs(items[0]?.start ?? Date.now())
    // const lastInteraction = (items[items.length - 1].end ?? items[items.length - 1].start) as Date
    const durationMs = nowMs - firstInteractionMs
    const clampedDurationMs = Math.max(
      durationMs,
      1000 * 60 * 60 * 24, // 1 day
    );
    const min = firstInteractionMs - clampedDurationMs * 0.05;
    const max = nowMs + clampedDurationMs * 0.05;
    return {
      min: min,
      max: max,
      stack: false,
      width: '100%',
      height: '120px',
      showMajorLabels: true,
      zoomMin: 10000000,
      format: {
        minorLabels: {
          minute: 'h:mma',
          hour: 'ha'
        }
      },
      onAdd: (item) => console.log(item),
      zoomFriction: 5,
      showCurrentTime: true,
      // TODO: Check that this is correct
      moment: function (date: Moment.MomentInput) {
        return Moment(date).utc();
      },
    }
  }, [items]);

  const timelineDivRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(false);
  const setupRef = useRef(false);

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

    const timeline = new Timeline(timelineDivRef.current!, itemsSampled, options)
    timeline.fit()
    timeline.setCurrentTime(new Date().toUTCString())

    type SelectProperties = {
      items: number[];
    }
    timeline.on('select', (properties: SelectProperties) => {
      const item = properties.items[0]
      onSelect?.(item)
    })

    type RangeChangedProperties = {
      start: DateType,
      end: DateType,
      byUser: boolean,
    }
    const trimRange = (properties: RangeChangedProperties) => {
      // console.log('trimming range', properties)
      const { start: rangeStart, end: rangeEnd } = properties;

      const beforeRangeItemsSampled = itemsSampled.filter((item) => utcMs(item.start) < utcMs(rangeStart));
      const afterRangeItemsSampled = itemsSampled.filter((item) => utcMs(item.start) > utcMs(rangeEnd));
      
      const inRangeItems = items.filter((item) => {
        const itemStartTime = utcMs(item.start);
        return itemStartTime >= utcMs(rangeStart) && itemStartTime <= utcMs(rangeEnd);
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
    timeline.on('rangechange', throttle(250, trimRange, { noLeading: true, noTrailing: false }))
    timeline.on('rangechanged', (properties: RangeChangedProperties) => 
      onRangeChanged?.([
        utcMs(properties.start),
        utcMs(properties.end)
      ]))

    console.log('setup complete')
    setupRef.current = true;
    loadRef.current = false;

    onTimeline?.(timeline)

    return () => {
      console.log('destroying')
      timeline.off('rangechange')
      timeline.off('select')
      timeline.destroy()
      setupRef.current = false
    }
  }, [items, itemsSampled, options, onTimeline, onSelect, onRangeChanged])

  return (
    <div className="w-[1000px] animate-fade-in relative">
      <div className='absolute z-50 left-0 top-0 bottom-0 w-[10%] bg-gradient-to-r from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div className='absolute z-50 right-0 top-0 bottom-0 w-[10%] bg-gradient-to-l from-gray-900/20 bg-blend-overlay pointer-events-none' />
      <div ref={timelineDivRef} />
    </div>
  )
}

export default TimelinePicker