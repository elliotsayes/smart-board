import { useCallback, useMemo, useState } from "react"
import { ContractDataFull } from "../types/contract"
import { useMachine } from "@xstate/react"
import { dashboardMachine } from "../machines/dashboard"
import TimelinePicker from "./TimelinePicker"
import DashboardBox from "./DashboardBox"
import ContractHeader from "./ContractHeader"
import { Timeline, TimelineItem } from "vis-timeline"
import InteractionDetails from "./InteractionDetails"

interface Props {
  contractData: Partial<ContractDataFull>
}

const Dashboard = (props: Props) => {
  const { contractData: contractDataProp } = props;

  const [timeline, setTimeline] = useState<Timeline>();

  const [current, send] = useMachine(
    () => dashboardMachine(),
    {
      devTools: import.meta.env.DEV,
      actions: {
        selectTimelineInteraction: (_, event) => {
          timeline?.setSelection(event.data.selectedInteractionIndex)
        },
      }
    },
  );

  // useEffect(() => {
  //   send({
  //     type: 'Update Contract Data',
  //     data: { contractData: contractDataProp },
  //   })
  // }, [contractDataProp, send])

  const timelineItems: TimelineItem[] = useMemo(() => 
    contractDataProp.interactionHistory?.map(
      (interaction, index) => ({
        id: index,
        content: '',
        start: interaction.block.timestamp * 1000,
        type: 'point',
      })
    ) ?? [],
    [contractDataProp],
  )

  const onSelectTimeline = useCallback((selectedInteractionIndex?: number) => {
    send({
      type: 'Timeline Interaction Selection',
      data: {selectedInteractionIndex} 
    })
  }, [send])

  const onRangeChanged = useCallback((range: [number, number]) => {
    send({
      type: 'Filter Time Range',
      data: {
        timeRange: {
          start: range[0],
          end: range[1],
        }
      }
    })
  }, [send])

  const contextLite = {
    ...current.context,
    contractData: undefined,
  }

  return (
    <div className="flex flex-col gap-2">
      <p>{JSON.stringify(contextLite)}</p>
      <DashboardBox
        loading={contractDataProp.meta === undefined}
      >
        <ContractHeader {...contractDataProp.meta!} />
      </DashboardBox>
      <DashboardBox
        loading={contractDataProp.interactionHistory === undefined}
      >
        {
          current.context.selectedInteractionIndex === undefined ? (
            <p>Select an interaction below.</p>
          ) : (
            <InteractionDetails
              interactionIndex={current.context.selectedInteractionIndex!}
              interactionCount={contractDataProp.interactionHistory!.length}
              interaction={contractDataProp.interactionHistory![current.context.selectedInteractionIndex!]}
            />
          )
        }
      </DashboardBox>
      <DashboardBox
        loading={contractDataProp.interactionHistory === undefined}
        padding={false}
      >
        <TimelinePicker
          items={timelineItems}
          onTimeline={setTimeline}
          onSelect={onSelectTimeline}
          onRangeChanged={onRangeChanged}
        />
      </DashboardBox>
    </div>
  )
}

export default Dashboard