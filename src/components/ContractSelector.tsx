import { useCallback, useRef } from "react"

interface Props {
  initialValue: string
  onSelect: (contractId: string) => void
}

const ContractSelector = ({initialValue, onSelect}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const onTrySubmit = useCallback(() => {
    if (inputRef.current?.value != undefined && inputRef.current?.value != "") {
      onSelect(inputRef.current!.value)
    }
  }, [onSelect])

  return (
    <div className="flex flex-row flex-grow gap-2 p-5 overflow-y-auto">
      <h1 className="whitespace-nowrap font-bold text-white/80">Contract ID:</h1>
      <input
        ref={inputRef}
        key={initialValue}
        defaultValue={initialValue}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            onTrySubmit()
          }
        }}
        className="flex flex-grow pl-2"
      />
      <button
        onClick={() => onTrySubmit()}
        className="border-2 border-white px-1"
      >
        →
      </button>
    </div>
  )
}

export default ContractSelector