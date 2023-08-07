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
  timeRangeFilter?: {
    start: number;
    end: number;
  }
  onListControls: (controls: ListControls) => void;
}

const InteractionListView = ({items, selectedInteractionIndex, onSelect, timeRangeFilter, onListControls}: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo<ColumnDef<ContractInteraction>[]>(
    () => [
      {
        id: 'sequence',
        accessorFn: (_, i) => i,
        header: '#',
        size: 40,
      },
      {
        id: 'timestamp',
        accessorKey: 'block.timestamp',
        header: 'Timestamp (UTC)',
        cell: (info) => <span>{Intl.DateTimeFormat('default', {
          dateStyle: 'short',
          timeStyle: 'medium',
        }).format((info.getValue() as number) * 1000)}</span>,
        // size: 80,
      },
      {
        id: 'blockHeight',
        accessorKey: 'block.height',
        header: 'Block#',
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
        // size: 80,
      },
      {
        id: 'transactionId',
        accessorKey: 'id',
        header: 'ID',
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
      },
      {
        id: 'ownerAddress',
        accessorKey: 'owner.address',
        header: 'Owner',
        cell: (info) => (
          <div className="flex items-center gap-1">
            <Identicon address={(info.getValue() as string).toString()} size={2} />
            <HashView hash={(info.getValue() as string).toString() ?? ''} />
          </div>
        ),
      },
      {
        id: 'functionName',
        accessorKey: 'functionName',
        header: 'Function',
      },
      {
        id: 'result',
        accessorKey: 'result',
        header: 'Result',
        cell: (info) => {
          const value = info.getValue() as ContractInteractionResult | undefined
          if (value === ContractInteractionResult.Error) {
            return <span><span className="text-red-500">ｘ</span> {value.toString()}</span>
          } else if (value === ContractInteractionResult.Update) {
            return <span><span className="text-green-500">✔</span> {value.toString()}</span>
          } else if (value === ContractInteractionResult.NoUpdate) {
            return <span><span className="text-yellow-500">‒</span> {value.toString()}</span>
          } else {
            return <span>Loading...</span>
          }
        },
        // size: 80,
      }
    ],
    []
  )

  const showColumnFilterIds = ['ownerAddress', 'functionName', 'result'];

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
          const targetIndex = Math.max(filteredRowIndex - 2, 0)
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
    <div className="pl-2 relative">
      <div ref={tableContainerRef} className="h-[300px] overflow-y-scroll">
        <table className="border-collapse table-fixed w-full">
          <thead className="sticky top-0 m-0 bg-gray-800/90 z-20">
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
                  className={`cursor-pointer ${selectedInteractionIndex === row.index ? 'bg-purple-400' : 'hover:bg-gray-200/20'}`}
                >
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id} className="pr-2">
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
      <div className="absolute bottom-0 left-0 px-2 py-1 bg-gray-800/60 text-lg text-gray-100/80 rounded-t-xl">
        {table.getRowModel().rows.length}/{data.length} Interactions
      </div>
    </div>
  )
}

function Filter({
  column,
  // table,
}: {
  column: Column<any, unknown>
  // table: Table<any>
}) {
  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () => Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return (
    <div className="pr-2">
      <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-full border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </div>
  )
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