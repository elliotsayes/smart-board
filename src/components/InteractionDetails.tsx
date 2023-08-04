import { ContractInteraction, ContractState } from "../types/contract";
import HashView from "./HashView";
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';

interface Props {
  interactionIndex: number;
  interactionCount: number;
  interaction: ContractInteraction;
  beforeState: ContractState;
  afterState: ContractState;
  preferShowDiff: boolean;
}

const InteractionDetails = ({interactionIndex, /*interactionCount,*/ interaction, beforeState, afterState, preferShowDiff}: Props) => {
  const interactionBlockDate = new Date(interaction.block.timestamp * 1000)
  
  const inputString = interaction.tags.find((tag) => tag.name == 'Input')?.value;
  const inputFunction = JSON.parse(inputString ?? '{}')?.['function'] as string | undefined;
  
  const otherTags = interaction.tags.filter((tag) => ['Input', 'App-Name', 'App-Version', 'Contract'].indexOf(tag.name) == -1);
  const otherTagsRecord = otherTags.reduce((acc, tag) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as Record<string, string>);

  const beforeStateJson = JSON.stringify(beforeState.cachedValue.state, null, 2);
  const afterStateJson = JSON.stringify(afterState.cachedValue.state, null, 2);
  const isDiff = beforeStateJson != afterStateJson;

  return (
    <div className="flex">
      <div>
        <p>#{interactionIndex}: <HashView hash={interaction.id} viewblock="tx" warpSonar="interaction" /></p>
        <p>Block <HashView hash={interaction.block.height.toString()} viewblock="block" /></p>
        <p>{interactionBlockDate.toISOString()}</p>
        <p>function: {inputFunction}</p>
        <p>tags: {Object.keys(otherTagsRecord).join(', ')}</p>
      </div>
      <div className="flex max-h-96 overflow-x-auto">
        {
          preferShowDiff && isDiff ? (
            <ReactDiffViewer
              oldValue={beforeStateJson}
              newValue={afterStateJson}
              splitView={false}
              showDiffOnly={true}
              hideLineNumbers={true}
              useDarkTheme={true}
              compareMethod={DiffMethod.JSON}
              styles={{
                contentText: {
                  fontSize: '14px',
                  lineHeight: '0.5',
                }
              }}
            />
          ) : (
            <pre style={{fontSize: '14px'}}>{afterStateJson}</pre>
          )
        }
      </div>
    </div>
  )
}

export default InteractionDetails