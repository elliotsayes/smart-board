import { useEffect, useMemo, useState } from "react"
import { ContractDataFull } from "../types/contract"
import { useMachine } from "@xstate/react"
import { dashboardMachine } from "../machines/dashboard"
import TimelinePicker from "./TimelinePicker"
import DashboardBox from "./DashboardBox"
import ContractHeader from "./ContractHeader"
import { ContractContext } from "./ContractManager"
import { Timeline } from "vis-timeline"

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

  useEffect(() => {
    send({
      type: 'Update Contract Data',
      data: { contractData: contractDataProp },
    })
  }, [contractDataProp, send])

  const timelineItems = useMemo(() => 
    contractDataProp.interactionHistory?.map(
      (interaction) => ({
        id: interaction.id,
        content: '',
        start: interaction.block.timestamp,
        type: 'point',
      })
    ),
    [contractDataProp],
  )

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
        padding={false}
      >
        <TimelinePicker
          items={timelineItems}
          onTimeline={(timeline) => setTimeline(timeline)}
          onSelect={
            (selectedInteractionIndex) => send({
              type: 'Timeline Interaction Selection',
              data: {selectedInteractionIndex} 
            })}
          onDeselect={
            () => send({
              type: 'Timeline Interaction Selection',
              data: {selectedInteractionIndex: undefined}
            })}
        />
      </DashboardBox>
    </div>
  )
}

export default Dashboard