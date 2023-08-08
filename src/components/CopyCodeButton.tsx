import { useState } from "react";
import { Tooltip } from "react-tooltip";
import HeroiconsClipboardDocument from '~icons/heroicons/clipboard-document'
import HeroiconsClipboardDocumentCheck from '~icons/heroicons/clipboard-document-check-solid'

interface Props {
  tooltipKey: string;
  copyText?: string;
}

const CopyCodeButton = ({tooltipKey: key, copyText}: Props) => {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative w-6 py-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (copyText) {
            navigator.clipboard.writeText(copyText);
            // Set to copied for 1 second. This will change tooltip text & icon
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
          }
        }}
        className="group"
        data-tooltip-id={`${key}-copy`}
        data-tooltip-content={copied ? "Copied!" : "Copy"}
      >
        <Tooltip id={`${key}-copy`} className="translate-x-2 -translate-y-4 z-30" />
        <HeroiconsClipboardDocumentCheck className={`text-[#D56DFB] absolute top-0 left-0 transition-opacity ${copied ? "opacity-100 duration-200" : "opacity-0 duration-1000"}`} />
        <HeroiconsClipboardDocument className={`group-hover:text-[#D56DFB] absolute top-0 left-0 transition-opacity ${copied ? "opacity-0 duration-200" : "opacity-100 duration-1000"}`} />
      </button>
    </div>
  )
}

export default CopyCodeButton