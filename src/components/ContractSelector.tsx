import { useRef } from "react"
import HeroiconsArrowRightCircle20Solid from '~icons/heroicons/arrow-right-circle-20-solid'

interface Props {
  initialValue: string
  onSelect: (contractId: string) => void
}

const ContractSelector = ({initialValue, onSelect}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-row flex-grow align-middle gap-2 p-2">
      <h1 className="whitespace-nowrap font-bold text-white/80">Contract ID</h1>
      <input
        ref={inputRef}
        key={initialValue}
        defaultValue={initialValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSelect(event.currentTarget.value)
          }
        }}
        className="flex flex-grow"
      />
      <button
        onClick={() => onSelect(inputRef.current!.value)}
      >
        <HeroiconsArrowRightCircle20Solid className="w-6 h-6" />
      </button>
    </div>
  )
}

export default ContractSelector