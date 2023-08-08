import { useEffect, useMemo, useRef } from 'react';
import { throttle } from 'throttle-debounce'
import { DateType, IdType, Timeline, type TimelineItem, type TimelineOptions } from 'vis-timeline/esnext';
import { utcMs } from '../utils/time';
import Moment from 'moment';
import 'vis-timeline/styles/vis-timeline-graph2d.css';
import './TimelinePicker.css'

const MAX_ITEMS = 500;

export type TimelineControls = {
  setSelection: (item?: number) => void,
  fit: () => void,
}

interface Props {
  items: TimelineItem[],
  onTimelineControls?: (timelineControls: TimelineControls) => void,
  onSelect?: (item?: number) => void,
  onRangeChanged?: (range: [number, number]) => void,
}

const TimelinePicker = (props: Props) => {
  const { items, onTimelineControls, onSelect, onRangeChanged } = props;

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
      zoomFriction: 5,
      showCurrentTime: true,
      moment: function (date: Moment.MomentInput) {
        return Moment(date).utc();
      },
      selectable: true,
      horizontalScroll: true,
    }
  }, [items]);

  const timelineDivRef = useRef<HTMLDivElement>(null);
  const loadRef = useRef(false);
  const setupRef = useRef(false);

  const itemsSampled = useMemo(() => {
    const itemCount = items.length
    if (itemCount <= MAX_ITEMS) return items;
    const globalRatio = itemCount / MAX_ITEMS
    return items.filter((_, i) => i % Math.ceil(globalRatio) === 0)
  }, [items])

  useEffect(() => {
    if (loadRef.current || setupRef.current) {
      return
    }
    loadRef.current = true;

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
    const trimRange = (properties: RangeChangedProperties, newSelection?: number) => {
      const { start: rangeStart, end: rangeEnd } = properties;

      const beforeRangeItemsSampled = itemsSampled.filter((item) => utcMs(item.start) < utcMs(rangeStart));
      const afterRangeItemsSampled = itemsSampled.filter((item) => utcMs(item.start) > utcMs(rangeEnd));
      
      const inRangeItems = items.filter((item) => {
        const itemStartTime = utcMs(item.start);
        return itemStartTime >= utcMs(rangeStart) && itemStartTime <= utcMs(rangeEnd);
      });
      const inRangeCount = inRangeItems.length;

      const selection = newSelection ?? timeline.getSelection()[0] as IdType | undefined;
      let renderItems: TimelineItem[];
      if (inRangeCount > MAX_ITEMS) {
        const inRangeRatio = inRangeCount / MAX_ITEMS
        const filteredItems = inRangeItems.filter((item, i) => ((i % Math.ceil(inRangeRatio) === 0) || item.id == selection))
        renderItems = [...beforeRangeItemsSampled, ...filteredItems, ...afterRangeItemsSampled]
        console.log('Timeline: showing filtered items', renderItems.length, inRangeCount)
      } else {
        renderItems = [...beforeRangeItemsSampled, ...inRangeItems, ...afterRangeItemsSampled]
        console.log('Timeline: showing all items', renderItems.length, inRangeCount)
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

    setupRef.current = true;
    loadRef.current = false;

    onTimelineControls?.({
      setSelection: (selection?: number) => {
        timeline.setSelection(selection ? [selection] : [])
        // Do not trim range due to performance issues
        // const window = timeline.getWindow()
        // trimRange({
        //   ...window,
        //   byUser: false,
        // }, selection)
      },
      fit: () => timeline.fit(),
    })

    return () => {
      timeline.off('rangechanged')
      timeline.off('rangechange')
      timeline.off('select')
      timeline.destroy()
      setupRef.current = false
    }
  }, [items, itemsSampled, options, onTimelineControls, onSelect, onRangeChanged])

  return (
    <div className="w-[100%] animate-fade-in relative p-2">
      <div ref={timelineDivRef} />
    </div>
  )
}

export default TimelinePicker