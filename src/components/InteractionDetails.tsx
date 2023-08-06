import { ContractInteraction, ContractState } from "../types/contract";
import HashView from "./HashView";
import * as Diff from 'diff';
import { useRef } from "react";
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import Switch from "react-switch";

interface Props {
  interactionIndex: number;
  interactionCount: number;
  interaction: ContractInteraction;
  beforeState: ContractState;
  afterState: ContractState;
  preferShowDiff: boolean;
  onChangeSelectedInteractionIndex: (index: number) => void;
  onChangePreferShowDiff: (preferShowDiff: boolean) => void;
}

const InteractionDetails = ({interactionIndex, interactionCount, interaction, beforeState, afterState, preferShowDiff, onChangeSelectedInteractionIndex, onChangePreferShowDiff}: Props) => {
  const interactionBlockDate = new Date(interaction.block.timestamp * 1000)
  
  const inputString = interaction.tags.find((tag) => tag.name == 'Input')?.value;
  const inputFunction = JSON.parse(inputString ?? '{}')?.['function'] as string | undefined;
  
  const otherTags = interaction.tags.filter((tag) => ['Input', 'App-Name', 'App-Version', 'Contract'].indexOf(tag.name) == -1);
  const otherTagsRecord = otherTags.reduce((acc, tag) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as Record<string, string>);

  const diff = Diff.diffJson(
    beforeState.cachedValue.state as object,
    afterState.cachedValue.state as object,
  );
  const hasDiff = diff.filter(d => d.added || d.removed).length > 0
  const showDiff = preferShowDiff && hasDiff;
  
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div>
          <p>#{interactionIndex}: <HashView hash={interaction.id} viewblock="tx" warpSonar="interaction" /></p>
          <p>Block <HashView hash={interaction.block.height.toString()} viewblock="block" /></p>
          <p>{interactionBlockDate.toISOString()}</p>
          <p>function: {inputFunction}</p>
          <p>tags: {Object.keys(otherTagsRecord).join(', ')}</p>
        </div>
        <div className="flex flex-col align-bottom">
          <div className={`flex ${hasDiff ? '' : 'opacity-50'}`}>
            <p>Diff View</p>
            <Switch
              onChange={(checked) => hasDiff && onChangePreferShowDiff(checked)}
              checked={showDiff}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor="#D56DFB"
              className="flex pl-2"
            />
          </div>
          <div className="max-h-96 overflow-x-auto">
            {
              showDiff ? (
                <ReactDiffViewer
                  oldValue={beforeState.cachedValue.state as object}
                  newValue={afterState.cachedValue.state as object}
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
                <pre style={{fontSize: '14px'}} className="w-96">
                  {JSON.stringify(afterState.cachedValue.state, undefined, 2)}
                </pre>
              )
            }
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <button 
          onClick={() => {
            onChangeSelectedInteractionIndex(interactionIndex - 1)
          }}
          disabled={interactionIndex < 1}
        > &lt;
        </button>
        <input
          key={interactionIndex}
          ref={inputRef}
          defaultValue={interactionIndex}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              const numberText = inputRef.current?.value;
              const number = parseInt(numberText ?? '');
              if (!isNaN(number) && number >= 0 && number < interactionCount) {
                onChangeSelectedInteractionIndex(number)
              }
            }
          }}
          className="w-16 text-center"
        />
        <button 
          onClick={() => {
            onChangeSelectedInteractionIndex(interactionIndex + 1)
          }}
          disabled={interactionIndex >= interactionCount - 1}
        > &gt;
        </button>
      </div>
    </div>
  )
}

export default InteractionDetails