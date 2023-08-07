import { useRef } from "react"

interface Props {
  initialValue: string
  onSelect: (contractId: string) => void
}

const ContractSelector = ({initialValue, onSelect}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-row flex-grow gap-2">
      <h1>Contract ID:</h1>
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
        ➡️
      </button>
    </div>
  )
}

export default ContractSelector