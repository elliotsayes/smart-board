import { ContractInteraction, ContractInteractionCacheHistory, ContractInteractionResult } from "../types/contract"
import { useEffect, useMemo, useRef, useState } from "react"
import {
  Column,
  Table,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  Row,
  useReactTable,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { useVirtual } from 'react-virtual'
import HashView from "./HashView";
import Identicon from "./Identicon";

interface Props {
  items: ContractInteractionCacheHistory;
  selectedInteractionIndex?: number;
  onSelect?: (selectedInteractionIndex: number) => void;
  timeRangeFilter?: {
    start: number;
    end: number;
  }
}

const InteractionListView = ({items, selectedInteractionIndex, onSelect, timeRangeFilter}: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns = useMemo<ColumnDef<ContractInteraction>[]>(
    () => [
      {
        id: 'sequence',
        accessorFn: (_, i) => i,
        header: '#',
      },
      {
        id: 'timestamp',
        accessorKey: 'block.timestamp',
        header: 'Time',
        cell: (info) => <span>{Intl.DateTimeFormat(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format((info.getValue() as number) * 1000)}</span>,
      },
      {
        id: 'blockHeight',
        accessorKey: 'block.height',
        header: 'Block#',
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
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
          <div className="flex">
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
          const value = info.getValue() as ContractInteractionResult
          if (value === ContractInteractionResult.Error) {
            return <span><span className="text-red-500">ｘ</span> error</span>
          } else if (value === ContractInteractionResult.Update) {
            return <span><span className="text-green-500">✔</span> changed</span>
          } else {
            return <span><span className="text-yellow-500">‒</span> no change</span>
          }
        }
      }
    ],
    []
  )

  const showColumnFilterIds = ['ownerAddress', 'functionName', 'result'];

  const [data, /*setData*/] = useState(() => items)

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  })
  
  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

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
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  return (
    <div className="px-2">
      <div ref={tableContainerRef} className="h-[300px] overflow-auto">
        <table className="border-collapse table-fixed w-[100%]">
          <thead className="sticky top-0 m-0 bg-gray-800/90 z-20">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
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
                              <Filter column={header.column} table={table} />
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
          <tbody className="w-[100%]">
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
                      <td key={cell.id}>
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
          </tbody>
        </table>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  )
}

function Filter({
  column,
  table,
}: {
  column: Column<any, unknown>
  table: Table<any>
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ''
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : (
    <>
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
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
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