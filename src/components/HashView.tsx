import { useState } from "react";
import { hashParts } from "../utils/crypto";
import { Tooltip } from 'react-tooltip'
import HeroiconsClipboardDocument from '~icons/heroicons/clipboard-document'
import HeroiconsClipboardDocumentCheck from '~icons/heroicons/clipboard-document-check-solid'
import HeroiconsCube from '~icons/heroicons/cube'
import HeroiconsCubeSolid from '~icons/heroicons/cube-solid'
import HeroiconsDocumentText from '~icons/heroicons/document-text'
import HeroiconsDocumentTextSolid from '~icons/heroicons/document-text-solid'

interface Props {
  hash: string;
  copy?: boolean;
  viewblock?: 'tx' | 'address' | 'block';
  warpSonar?: 'contract' | 'source' | 'interaction' | 'creator';
}

const HashView = ({hash, copy = true, viewblock, warpSonar}: Props) => {
  const doShorten = hash.length > 10;
  const parts = doShorten ? hashParts(hash) : [hash];

  const [copied, setCopied] = useState(false);

  return (
    <div className="flex flex-row items-baseline justify-start">
      {
        (!doShorten) && <Tooltip id="hash" className="font-mono z-30" delayShow={250} />
      }
      <code
        className="bg-gray-200/10 pt-1 px-2 rounded-md flex flex-row"
        {...(doShorten && {
          "data-tooltip-id": "hash",
          "data-tooltip-content": hash,
        })}
      >
        {parts.map((part, index) => (
          <>
            <span key={`${index}_text`} className="whitespace-nowrap">
              {part}
            </span>
            {index < parts.length - 1 && (
              <span className="opacity-50">
                ...
              </span>
            )}
          </>
        ))}
      </code>
      <div className="pl-2 flex flex-row">
      {
        copy && (
          <div className="relative w-6">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(hash);
                // Set to copied for 1 second. This will change tooltip text & icon
                setCopied(true);
                setTimeout(() => setCopied(false), 1000);
              }}
              className="group"
              data-tooltip-id="copy"
              data-tooltip-content={copied ? "Copied!" : "Copy"}
            >
              <Tooltip id="copy" className="translate-x-2 -translate-y-4 z-30" />
              <HeroiconsClipboardDocumentCheck className={`text-[#D56DFB] absolute top-0 left-0 transition-opacity ${copied ? "opacity-100 duration-200" : "opacity-0 duration-1000"}`} />
              <HeroiconsClipboardDocument className={`group-hover:text-[#D56DFB] absolute top-0 left-0 transition-opacity ${copied ? "opacity-0 duration-200" : "opacity-100 duration-1000"}`} />
            </button>
          </div>
        )
      }
      {
        viewblock && (
          <div className="relative w-6">
            <a
              href={`https://viewblock.io/arweave/${viewblock}/${hash}`}
              target="_blank"
              className="group"
              data-tooltip-id="viewblock"
              data-tooltip-content={`View ${viewblock} on Viewblock`}
            >
              <Tooltip id="viewblock" className="translate-x-2 z-30" />
              <HeroiconsCubeSolid className={`text-[#D56DFB] absolute top-0 left-0 transition-all group-hover:opacity-100 opacity-0 duration-1000"}`} />
              <HeroiconsCube className={`absolute top-0 left-0 transition-all group-hover:opacity-0 opacity-100 duration-1000"`} />
            </a>
          </div>
        )
      }
      {
        warpSonar && (
          <div className="relative w-6">
            <a
              href={`https://sonar.warp.cc/#/app/${warpSonar}/${hash}`}
              target="_blank"
              className="group"
              data-tooltip-id="warpSonar"
              data-tooltip-content={`View ${warpSonar} on Warp Sonar`}
            >
              <Tooltip id="warpSonar" className="translate-x-2 z-30" />
              <HeroiconsDocumentTextSolid className={`text-[#D56DFB] absolute top-0 left-0 transition-all group-hover:opacity-100 opacity-0 duration-1000"}`} />
              <HeroiconsDocumentText className={`absolute top-0 left-0 transition-all group-hover:opacity-0 opacity-100 duration-1000"`} />
            </a>
          </div>
        )
      }
      </div>
    </div>
  )
}

export default HashView