import { ContractInteraction, ContractState } from "../types/contract";
import HashView from "./HashView";
import * as Diff from 'diff';
import { useRef } from "react";
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer-continued';
import Switch from "react-switch";
import PrismPreJson from "./PrismPreJson";
import CopyCodeButton from "./CopyCodeButton";

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
  const { inputString } = interaction;
  const inputStringFormatted = (() => {
    try {
      return JSON.stringify(JSON.parse(inputString!), null, 2);
    } catch (e) {
      return inputString;
    }
  })();
  
  const interactionBlockDate = new Date(interaction.block.timestamp * 1000);
  const otherTags = interaction.tags.filter((tag) => ['Input', 'App-Name', 'App-Version', 'Contract'].indexOf(tag.name) == -1);
  const otherTagsRecord = otherTags.reduce((acc, tag) => {
    acc[tag.name] = tag.value;
    return acc;
  }, {} as Record<string, string>);

  const beforeStateObject = beforeState.cachedValue.state as object;
  const afterStateObject = afterState.cachedValue.state as object;

  const diff = Diff.diffJson(
    beforeStateObject,
    afterStateObject,
  );
  const hasDiff = diff.filter(d => d.added || d.removed).length > 0
  const showDiff = preferShowDiff && hasDiff;
  
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col w-[100%] p-2">
      <div className="flex flex-col md:flex-row justify-evenly items-center lg:items-start gap-4">
        <div className="rounded-lg bg-gradient-to-r from-[#D56DFB] to-[#0085FF] p-1">
          <div className="bg-black rounded-lg h-full">
            <div className="p-2">Interaction #{interactionIndex}: <HashView hash={interaction.id} viewblock="tx" warpSonar="interaction" /></div>
            <div className="p-2">Block <HashView hash={interaction.block.height.toString()} viewblock="block" /></div>
            <div className="p-2">{interactionBlockDate.toLocaleString()}</div>
          </div>
        </div>
        <div className="flex flex-col justify-evenly max-w-md overflow-y-auto overscroll-y-contain">
          <div className="flex flex-col align-bottom rounded-lg bg-code-pen max-w-lg w-[100%]">
            <div className={`flex justify-between p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]`}>
              <p>Input</p>
              <CopyCodeButton tooltipKey="input" copyText={inputString} />
            </div>
            <div className="overflow-x-auto p-2">
              <PrismPreJson str={inputStringFormatted ?? '<empty>'} />
            </div>
          </div>
          <div className="flex flex-col align-bottom rounded-lg bg-code-pen max-w-md w-[100%]">
            <div className={`flex justify-between p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]`}>
              <p>Additional Tags</p>
              <CopyCodeButton tooltipKey="tags" copyText={JSON.stringify(otherTagsRecord)} />
            </div>
            <div className="overflow-x-auto p-2">
              <PrismPreJson str={JSON.stringify(otherTagsRecord, undefined, 2)} />
            </div>
          </div>
        </div>
        <div className="flex flex-col align-bottom rounded-lg bg-code-pen max-w-lg">
          <div className={`flex flex-grow justify-between p-2 rounded-t-lg bg-code-pen drop-shadow-[0_2px_7px_rgb(0,0,0)]`}>
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
            <CopyCodeButton tooltipKey="afterstate" copyText={JSON.stringify(afterStateObject)} />
          </div>
          <div className="max-h-96 overflow-x-auto p-2">
            <ReactDiffViewer
              oldValue={showDiff ? beforeStateObject : afterStateObject}
              newValue={afterStateObject}
              splitView={false}
              showDiffOnly={showDiff}
              hideLineNumbers={true}
              useDarkTheme={true}
              compareMethod={DiffMethod.JSON}
              styles={{
                contentText: {
                  fontSize: '14px',
                  lineHeight: '0.5',
                }
              }}
              renderContent={(str) => <PrismPreJson str={str} />}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center pt-6">
        <button 
          onClick={() => {
            onChangeSelectedInteractionIndex(interactionIndex - 1)
          }}
          disabled={interactionIndex < 1}
          className="bg-pink rounded-md py-1 px-3 text-sm/[16px]"
        > &lt; Previous
        </button>
        <input
          key={interactionIndex}
          ref={inputRef}
          defaultValue={interactionIndex}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              const numberText = inputRef.current?.value;
              const number = parseInt(numberText ?? '');
              if (!isNaN(number) && number >= 0) {
                if (number > interactionCount) {
                  onChangeSelectedInteractionIndex(interactionCount - 1)
                } else {
                  onChangeSelectedInteractionIndex(number)
                }
              }
            }
          }}
          className="w-16 text-center text-white bg-gray-100/20 text-gray-100/80 placeholder:text-gray-100/20 rounded-md"
        />
        <button 
          onClick={() => {
            onChangeSelectedInteractionIndex(interactionIndex + 1)
          }}
          disabled={interactionIndex >= interactionCount - 1}
          className="bg-blue rounded-md py-1 px-6 text-sm/[16px]"
        > Next &gt;
        </button>
      </div>
    </div>
  )
}

export default InteractionDetails