import { ContractInteraction, ContractInteractionWithResultHistory, ContractInteractionHistory, ContractInteractionResult } from "../types/contract"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Column,
  // Table,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedUniqueValues,
  Row,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtual } from 'react-virtual'
import HashView from "./HashView";
import Identicon from "./Identicon";

export type ListControls = {
  scrollToIndex: (index: number) => void;
}

interface Props {
  items: ContractInteractionHistory | ContractInteractionWithResultHistory;
  selectedInteractionIndex?: number;
  onSelect?: (selectedInteractionIndex: number) => void;
  onClearTimeFilter?: () => void;
  timeRangeFilter?: {
    start: number;
    end: number;
  }
  onListControls: (controls: ListControls) => void;
}

const InteractionListView = ({items, selectedInteractionIndex, onSelect, timeRangeFilter, onListControls, onClearTimeFilter}: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo<ColumnDef<ContractInteraction>[]>(
    () => [
      {
        id: 'sequence',
        accessorFn: (_, i) => i,
        header: '#',
        size: 40,
      },
      // {
      //   id: 'blockHeight',
      //   accessorKey: 'block.height',
      //   header: 'Block#',
      //   cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
      //   // size: 80,
      // },
      {
        id: 'transactionId',
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
        size: 165,
      },
      {
        id: 'timestamp',
        accessorKey: 'block.timestamp',
        header: 'Timestamp (UTC)',
        cell: (info) => <span className="whitespace-nowrap overflow-clip">{Intl.DateTimeFormat('default', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format((info.getValue() as number) * 1000)}</span>,
        size: 180,
        // minSize: 120,
      },
      {
        id: 'ownerAddress',
        accessorKey: 'owner.address',
        header: 'Owner',
        cell: (info) => (
          <div className="flex justify-start">
            <Identicon address={(info.getValue() as string).toString()} size={2} />
            <HashView hash={(info.getValue() as string).toString() ?? ''} />
          </div>
        ),
        size: 185,
      },
      {
        id: 'functionName',
        accessorKey: 'functionName',
        header: 'Function',
        cell: (info) => <div className="whitespace-nowrap overflow-clip text-ellipsis font-mono">{(info.getValue() as string | undefined ?? '').toString()}</div>,
      },
      {
        id: 'result',
        accessorKey: 'result',
        header: 'Result',
        cell: (info) => {
          const value = info.getValue() as ContractInteractionResult | undefined
          if (value === ContractInteractionResult.Error) {
            return <span className="whitespace-nowrap"><span className="text-red-500">ｘ</span> {value.toString()}</span>
          } else if (value === ContractInteractionResult.Update) {
            return <span className="whitespace-nowrap"><span className="text-green-500">✔</span> {value.toString()}</span>
          } else if (value === ContractInteractionResult.NoUpdate) {
            return <span className="whitespace-nowrap"><span className="text-yellow-500">‒</span> {value.toString()}</span>
          } else {
            return <span>Loading...</span>
          }
        },
        size: 120,
      }
    ],
    []
  )

  const showColumnFilterIds = ['timestamp', 'ownerAddress', 'functionName', 'result'];

  const data = items;

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
  })

  useEffect(() => {
    if (timeRangeFilter) {
      table.getColumn('timestamp')?.setFilterValue(() => [timeRangeFilter.start, timeRangeFilter.end])
    }
  }, [table, timeRangeFilter]);

  const tableContainerRef = useRef<HTMLDivElement>(null)

  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  })
  const { virtualItems: virtualRows, totalSize, scrollToIndex } = rowVirtualizer
  
  useEffect(() => {
    onListControls({
      scrollToIndex: (index) => {
        const itemId = items[index].id
        const filteredRowIndex = rows.findIndex((row) => row.original.id === itemId)
        if (filteredRowIndex !== -1) {
          const targetIndex = Math.max(filteredRowIndex - 4, 0)
          scrollToIndex(targetIndex, {
            align: 'end',
          })
        }
      },
    })
  }, [items, rows, onListControls, scrollToIndex])

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <div className="relative w-[100%] overscroll-x-contain">
      <div ref={tableContainerRef} className=" overflow-y-scroll h-72 w-[100%] my-0">
        <table className="border-collapse table-fixed w-[100%]">
          <thead className="sticky top-0 m-0 bg-gradient-to-r from-[#D56DFB] to-[#0085FF] z-20">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                      className="text-left"
                    >
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              // className: header.column.getCanSort()
                              //   ? 'cursor-pointer select-none'
                              //   : '',
                              // onClick: header.column.getToggleSortingHandler(),
                            }}
                            className="pl-2"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: ' 🔼',
                              desc: ' 🔽',
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                          {(showColumnFilterIds.findIndex(x => x == header.column.id) != -1) ? (
                            <div>
                              <Filter
                                column={header.column} 
                                // table={table}
                                items={items}
                                // onClearTimeFilter={onClearTimeFilter}
                              />
                            </div>
                          ) : null}
                        </>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<ContractInteraction>
              return (
                <tr
                  key={row.id} 
                  onClick={() => onSelect?.(row.index)}
                  className={`cursor-pointer ${selectedInteractionIndex === row.index ? 'bg-gradient-to-r from-[#d56dfb80] to-[#d56dfb80]' : 'hover:bg-[#2C2A2D]'}`}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className="px-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
            {/* Room for the bottom bit */}
            <tr>
              <td className="h-10" />
            </tr>
          </tbody>
        </table>
      </div>
      <div className="absolute bottom-0 right-4 px-2 py-1 bg-gray-800/60 text-md text-gray-100/80 rounded-t-xl items-center">
        Listing {table.getRowModel().rows.length}/{data.length} Interactions
        {
          table.getRowModel().rows.length < data.length && (
            <button
              onClick={() => {
                table.resetColumnFilters()
                onClearTimeFilter?.()
              }}
              className="px-1 text-sm border-[1px] border-gray-100/80 rounded-md mx-1"
            >
              Reset
            </button>
          )
        }
      </div>
    </div>
  )
}

function Filter({
  column,
  // table,
  items,
  // onClearTimeFilter,
}: {
  column: Column<any, unknown>
  // table: Table<any>
  items: ContractInteractionHistory
  // onClearTimeFilter?: () => void
}) {
  const isTimestamp = column.id === 'timestamp'

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () => isTimestamp ? [] : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  if (isTimestamp) {
    const def = (
      <div className="pl-2 text-sm font-normal">
        <span className="text-purple-100/60">{'<all time>'}</span>
      </div>
    )
    if (!(columnFilterValue instanceof Array)) {
      return def
    }
    const [start, end] = columnFilterValue as number[]
    const isOutside = start < items[0].block.timestamp && end > items[items.length - 1].block.timestamp
    if (isOutside) {
      return def
    }
    const duration = Math.round(end - start)
    const startDate = new Date(start * 1000)
    const endDate = new Date(end * 1000)
    const displayComponent = (() => {
      if ((duration < (60 * 60 * 24)) && (startDate.getDate() === endDate.getDate())) {
        return (
          <span className="text-purple-100/80">
            <span>{Intl.DateTimeFormat('default', {dateStyle: 'short'}).format(startDate)}</span>
            <span>{' '}</span>
            <span className=" whitespace-nowrap">
              <span>{'('}</span>
              <span>{Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(startDate)}</span>
              <span>-</span>
              <span>{Intl.DateTimeFormat('default', {timeStyle: 'short'}).format(endDate)}</span>
              <span>{')'}</span>
            </span>
          </span>
        )
      } else {
        return (
          <span className="text-purple-100/80">
            <span>{Intl.DateTimeFormat('default', {dateStyle: 'short'}).format(startDate)}</span>
            <span> - </span>
            <span>{Intl.DateTimeFormat('default', {dateStyle: 'short'}).format(endDate)}</span>
          </span>
        )
      }
    })();
    return (
      <div className="pl-2 text-sm font-normal">
        {displayComponent}
        {/* <button 
          onClick={() => {
            onClearTimeFilter?.()
          }}
          className="pl-1 text-xs opacity-80"
        >
          ❌
        </button> */}
      </div>
    )
  } else {
    return (
      <div className="px-2">
        <datalist id={column.id + 'list'} className="">
          {sortedUniqueValues.slice(0, 5000).map((value: any) => (
            <option value={value} key={value} />
          ))}
        </datalist>
        <DebouncedInput
          type="text"
          value={(columnFilterValue ?? '') as string}
          onChange={value => column.setFilterValue(value)}
          placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
          className="w-full shadow rounded px-1 bg-gray-100/30 text-gray-100 placeholder:text-gray-100/80 font-semibold"
          list={column.id + 'list'}
        />
        <div className="h-1" />
      </div>
    )
  } 
}

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}


export default InteractionListView