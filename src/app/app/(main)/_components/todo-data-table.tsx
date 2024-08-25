'use client'

// Importando as dependências necessárias
import * as React from 'react'
import { CaretSortIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Todo } from '../types'
import { useRouter } from 'next/navigation'
import { deleteTodo, upsertTodo } from '../actions'
import { toast } from '@/components/ui/use-toast'

// Definição do tipo de dado esperado pela tabela
type TodoDataTable = {
  data: Todo[]
}

// Função principal que define a tabela de dados dos "todos"
export function TodoDataTable({ data }: TodoDataTable) {
  const router = useRouter()

  // Estados locais para armazenar as configurações da tabela
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  // Função para lidar com a exclusão de um "todo"
  const handleDeleteTodo = async (todo: Todo) => {
    await deleteTodo({ id: todo.id })
    router.refresh()

    // Exibir uma notificação de sucesso
    toast({
      title: 'Deletion Successful',
      description: 'The todo item has been successfully deleted.',
    })
  }

  // Função para alternar o status de um "todo" (feito/não feito)
  const handleToggleDoneTodo = async (todo: Todo) => {
    // Alterna o valor de doneAt entre null e a data atual
    const doneAt = todo.doneAt ? null : new Date().toISOString()

    await upsertTodo({ id: todo.id, doneAt })
    router.refresh()

    // Exibir uma notificação de sucesso
    toast({
      title: 'Update Successful',
      description: 'The todo item has been successfully updated.',
    })
  }

  // Definição das colunas da tabela
  const columns: ColumnDef<Todo>[] = [
    {
      accessorKey: 'status', // Chave que acessa o status do todo
      header: 'Status', // Cabeçalho da coluna
      cell: ({ row }) => {
        const { doneAt } = row.original

        // Definindo o status e o estilo baseado no estado de doneAt
        const status: 'done' | 'waiting' = doneAt ? 'done' : 'waiting'
        const variant: 'outline' | 'secondary' = doneAt
          ? 'outline'
          : 'secondary'

        return <Badge variant={variant}>{status}</Badge>
      },
    },
    {
      accessorKey: 'title', // Chave que acessa o título do todo
      header: ({ column }) => {
        return (
          <Button
            variant="link"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Title
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue('title')}</div>,
    },
    {
      accessorKey: 'createdAt', // Chave que acessa a data de criação do todo
      header: () => <div className="text-right">createdAt</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium">
            {row.original.createdAt.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      id: 'actions', // Coluna para as ações (editar, excluir, etc.)
      enableHiding: false, // Desabilita a possibilidade de esconder esta coluna
      cell: ({ row }) => {
        const todo = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(todo.id)}
              >
                Copy todo ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleToggleDoneTodo(todo)}>
                Mark as done
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteTodo(todo)}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Configuração da tabela com as colunas e dados definidos acima
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting, // Função para alterar a ordenação
    onColumnFiltersChange: setColumnFilters, // Função para alterar os filtros de coluna
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility, // Função para alterar a visibilidade das colunas
    onRowSelectionChange: setRowSelection, // Função para alterar a seleção das linhas
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Renderização da tabela
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
