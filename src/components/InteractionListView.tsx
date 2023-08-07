import { ContractInteraction } from "../types/contract"
import { useMemo, useRef, useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtual } from 'react-virtual'
import HashView from "./HashView";
import Identicon from "./Identicon";

interface Props {
  items: ContractInteraction[];
  selectedInteractionIndex?: number;
  onSelect?: (selectedInteractionIndex: number) => void;
}

const InteractionListView = ({items, /*selectedInteractionIndex,*/ onSelect}: Props) => {
  const columns = useMemo<ColumnDef<ContractInteraction>[]>(
    () => [
      {
        accessorFn: (_, i) => i,
        header: '#',
        size: 30,
      },
      {
        accessorKey: 'block.timestamp',
        header: 'Time',
        cell: (info) => <span>{Intl.DateTimeFormat(undefined, {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format((info.getValue() as number) * 1000)}</span>,
      },
      {
        accessorKey: 'block.height',
        header: 'Block#',
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
      },
      {
        accessorKey: 'id',
        header: 'ID',
        size: 60,
        cell: (info) => <HashView hash={(info.getValue() as string).toString() ?? ''} />,
      },
      {
        accessorKey: 'owner.address',
        header: 'Owner',
        cell: (info) => (
          <div className="flex">
            <Identicon address={(info.getValue() as string).toString()} size={2} />
            <HashView hash={(info.getValue() as string).toString() ?? ''} />
          </div>
        ),
      },
    ],
    []
  )

  const [data, /*setData*/] = useState(() => items)

  const table = useReactTable({
    data,
    columns,
    state: {
      // sorting,
    },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

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
    <div className="p-2 max-h-48 w-[100%] overflow-y-auto overscroll-x-contain">
      <div className="h-2" />
      <div ref={tableContainerRef} className="container w-[100%]">
        <table className="w-[100%]">
          <thead>
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
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
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
                <tr key={row.id} onClick={() => onSelect?.(virtualRow.index)}>
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

export default InteractionListView