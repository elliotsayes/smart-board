import { useRef } from "react"

interface Props {
  initialValue: string
  onSelect: (contractId: string) => void
}

const ContractSelector = ({initialValue, onSelect}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-row flex-grow gap-2 p-3">
      <h1 className="whitespace-nowrap">Contract ID:</h1>
      <input
        ref={inputRef}
        key={initialValue}
        defaultValue={initialValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onSelect(event.currentTarget.value)
          }
        }}
        className="flex flex-grow pl-2"
      />
      <button
        onClick={() => onSelect(inputRef.current!.value)}
        className="border-2 border-white px-1"
      >
        →
      </button>
    </div>
  )
}

export default ContractSelector