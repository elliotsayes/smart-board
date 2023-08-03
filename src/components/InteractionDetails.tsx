import { ContractInteraction } from "../types/contract";

interface Props {
  interactionIndex: number;
  interactionCount: number;
  interaction: ContractInteraction;
}

const InteractionDetails = ({interactionIndex, interaction}: Props) => {
  const interactionBlockDate = new Date(interaction.block.timestamp * 1000)
  const inputString = interaction.tags.find((tag) => tag.name == 'Input')?.value;
  const inputFunction = JSON.parse(inputString ?? '{}')?.['function'] as string | undefined;
  const otherTags = interaction.tags.filter((tag) => ['Input', 'App-Name', 'App-Version', 'Contract'].indexOf(tag.name) == -1);
  const otherTagsRecord = otherTags.reduce((acc, tag) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div>
      <p>#{interactionIndex}: <code className="text-xs">{interaction.id}</code></p>
      <p>{interactionBlockDate.toISOString()}</p>
      <p>function: {inputFunction}</p>
      <p>tags: {Object.keys(otherTagsRecord).join(', ')}</p>
    </div>
  )
}

export default InteractionDetails