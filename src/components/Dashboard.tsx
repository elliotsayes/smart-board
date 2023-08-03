import { useEffect, useMemo } from "react"
import { ContractDataFull } from "../types/contract"
import { useMachine } from "@xstate/react"
import { dashboardMachine } from "../machines/dashboard"
import TimelinePicker from "./TimelinePicker"
import DashboardBox from "./DashboardBox"
import ContractHeader from "./ContractHeader"

interface Props {
  contractData: Partial<ContractDataFull>
}

const Dashboard = (props: Props) => {
  const { contractData: contractDataProp } = props;

  const [current, send] = useMachine(
    () => dashboardMachine(),
    { devTools: true },
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

  return (
    <>
    <div className="flex flex-col gap-2">
      <DashboardBox
        loading={current.context.contractData.meta === undefined}
      >
        <ContractHeader {...current.context.contractData.meta!} />
      </DashboardBox>
      <DashboardBox
        loading={contractDataProp.interactionHistory === undefined}
        padding={false}
      >
        <TimelinePicker
          items={timelineItems}
          onTimeline={
            (timeline) => send({
              type: 'Set Timeline',
              data: {timeline}
            })}
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
    </>
  )
}

export default Dashboard