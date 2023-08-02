import { useEffect } from "react"
import { ContractDataFull } from "../types/contract"
import { useMachine } from "@xstate/react"
import { dashboardMachine } from "../machines/dashboard"
import TimelinePicker from "./TimelinePicker"

interface Props {
  contractData: Partial<ContractDataFull>
}

const Dashboard = ({ contractData }: Props) => {
  const [current, send] = useMachine(() => dashboardMachine());

  useEffect(() => {
    send({ type: 'Update Contract Data', data: { contractData }})
  }, [send, contractData])

  return (
    <>
      <div>
        {JSON.stringify(current.value)}
      </div>
      <div>
        {
          contractData.interactionHistory && (
            <TimelinePicker
              items={
                contractData.interactionHistory.map((interaction) => ({
                  id: interaction.id,
                  content: '',
                  start: interaction.block.timestamp,
                }))
              }
            />
          )
        }
      </div>
    </>
  )
}

export default Dashboard