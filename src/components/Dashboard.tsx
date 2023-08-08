import { useCallback, useMemo, useState } from "react"
import { ContractDataFull } from "../types/contract"
import { useMachine } from "@xstate/react"
import { dashboardMachine } from "../machines/dashboard"
import TimelinePicker from "./TimelinePicker"
import DashboardBox from "./DashboardBox"
import ContractHeader from "./ContractHeader"
import { Timeline, TimelineItem } from "vis-timeline"
import InteractionDetails from "./InteractionDetails"
import DashboardTabs from "./DashboardTabs"
import StateOverview from "./StateOverview"
import InteractionListView from "./InteractionListView"

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

  // const interactionHistoryPassFilter = useMemo(() => {
  //     return contractDataProp.interactionHistory?.map(
  //       (interaction) => {
  //         const isInrange = current.context.filter.timeRange === undefined || (
  //           interaction.block.timestamp >= current.context.filter.timeRange?.start &&
  //           interaction.block.timestamp <= current.context.filter.timeRange?.end
  //         )
  //         return isInrange
  //       }
  //     ) ?? []
  //   },
  //   [contractDataProp.interactionHistory, current.context.filter],
  // )

  const timelineItems: TimelineItem[] = useMemo(() => 
    contractDataProp.interactionHistory?.map(
      (interaction, index) => ({
        id: index,
        content: '',
        start: interaction.block.timestamp * 1000,
        type: 'point',
        // selectable: interactionHistoryPassFilter[index],
      })
    ) ?? [],
    [contractDataProp.interactionHistory],
  )

  // useEffect(() => {
  //   timeline?.setItems(timelineItems)
  // }, [timeline, timelineItems])

  const onSelectTimeline = useCallback((selectedInteractionIndex?: number) => {
    send({
      type: 'Timeline Interaction Selection',
      data: {selectedInteractionIndex} 
    })
    if (selectedInteractionIndex !== undefined) {
      send({
        type: 'Interaction Tab',
      })
    }
  }, [send])

  const onRangeChanged = useCallback((range: [number, number]) => {
    send({
      type: 'Filter Time Range',
      data: {
        timeRange: {
          start: range[0] / 1000,
          end: range[1] / 1000,
        }
      }
    })
  }, [send])

  const contextLite = {
    ...current.context,
    contractData: undefined,
  }

  return (
    <div className="flex flex-col gap-4 max-w-[1400px] mx-auto my-0">
      <p>{JSON.stringify(contextLite)}</p>
      <DashboardBox
        loading={contractDataProp.meta === undefined}
      >
        <ContractHeader {...contractDataProp.meta!} />
      </DashboardBox>
      <DashboardTabs 
        tabIndex={current.context.viewportTab}
        titles={['State Overview', 'Interaction Details']}
        onTabChange={(tabIndex: number) => {
          if (tabIndex === 0) {
            send({
              type: 'State Tab',
            })
          } else if (tabIndex === 1) {
            send({
              type: 'Interaction Tab',
            })
          }
        }}
      >
        <DashboardBox loading={contractDataProp.initialState === undefined} >
          <StateOverview
            initialState={contractDataProp.initialState!}
            latestState={contractDataProp.latestState}
          />
        </DashboardBox>
        <DashboardBox
          loading={contractDataProp.interactionHistory === undefined || contractDataProp.stateHistory === undefined}
        >
          {
            current.context.selectedInteractionIndex === undefined ? (
              <p>Select an interaction below.</p>
            ) : (
              <InteractionDetails
                interactionIndex={current.context.selectedInteractionIndex!}
                interactionCount={contractDataProp.interactionHistory!.length}
                interaction={contractDataProp.interactionHistory![current.context.selectedInteractionIndex!]}
                beforeState={contractDataProp.stateHistory![current.context.selectedInteractionIndex!]}
                afterState={contractDataProp.stateHistory![current.context.selectedInteractionIndex! + 1]}
                preferShowDiff={current.context.viewportInteractionShowDiff}
                onChangeSelectedInteractionIndex={
                  (selectedInteractionIndex: number) => send({
                    type: 'List Interaction Selection',
                    data: { selectedInteractionIndex },
                  })
                }
                onChangePreferShowDiff={
                  (viewportInteractionShowDiff: boolean) => send({
                    type: 'Set Interaction Diff',
                    data: { viewportInteractionShowDiff },
                  })
                }
              />
            )
          }
        </DashboardBox>
      </DashboardTabs>
      <DashboardBox
        loading={contractDataProp.stateHistory === undefined}
      >
        <InteractionListView
          items={contractDataProp.interactionHistory!}
          selectedInteractionIndex={current.context.selectedInteractionIndex}
          onSelect={(selectedInteractionIndex) => {
            send({
              type: 'List Interaction Selection',
              data: { selectedInteractionIndex },
            })
            send({
              type: "Interaction Tab",
            })
          }}
        />
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