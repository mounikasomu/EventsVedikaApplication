import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { 
  useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, 
  flexRender, type ColumnDef, type SortingState, type ColumnFiltersState
} from '@tanstack/react-table';
import { customerService } from '../services/customerService';
import type { Customer } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Card, CardContent } from '../components/ui/Card';

import { 
  Search, Plus, ChevronLeft, ChevronRight, 
  UserPlus, RefreshCw, ShieldCheck, TrendingUp, Filter
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'New': return 'blue';
    case 'In Progress': return 'warning';
    case 'Closed': return 'success';
    default: return 'default';
  }
};

const getEventTypeBadgeVariant = (type: string) => {
  switch (type) {
    case 'Marriage':
    case 'Wedding': return 'blue';
    case 'Corporate Event': return 'default';
    case 'Birthday': return 'purple';
    default: return 'outline';
  }
};

const getLeadTypeIcon = (type: string) => {
  // Return emoji or simple text icon representation
  switch (type) {
    case 'Website': return '🌐';
    case 'Referral': return '🔥';
    case 'Walk-In': return '🚶';
    case 'Social Media': return '📱';
    case 'Phone Call': return '📞';
    default: return '📄';
  }
};

export const CustomerListPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<Customer[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    if (user) {
      setData(customerService.getCustomersForUser(user));
    }
  }, [user]);

  const columns = useMemo<ColumnDef<Customer>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onChange={table.getToggleAllPageRowsSelectedHandler()}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'customerName',
      header: 'CUSTOMER NAME',
      cell: ({ row }) => {
        const name = row.original.customerName;
        const initials = name.substring(0, 2).toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              {initials}
            </div>
            <span className="font-medium text-foreground">{name}</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'email',
      header: 'EMAIL ID',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>
    },
    {
      accessorKey: 'guestCount',
      header: 'GUEST COUNT',
      cell: ({ row }) => <span className="font-medium">{row.original.guestCount.toLocaleString()}</span>
    },
    {
      accessorKey: 'eventLocation',
      header: 'LOCATION',
    },
    {
      accessorKey: 'eventType',
      header: 'EVENT TYPE',
      cell: ({ row }) => {
        const type = row.original.eventType;
        return (
          <Badge variant={getEventTypeBadgeVariant(type as string)}>
            {type}
          </Badge>
        );
      },
      filterFn: 'equalsString'
    },
    {
      accessorKey: 'leadType',
      header: 'LEAD TYPE',
      cell: ({ row }) => {
        const type = row.original.leadType;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <span>{getLeadTypeIcon(type)}</span>
            <span className={type === 'Referral' ? 'text-orange-600 font-medium' : 'text-blue-600 font-medium'}>
              {type === 'Referral' ? 'Hot' : type === 'Website' ? 'Warm' : 'Cold'}
            </span>
          </div>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
      filterFn: 'equalsString'
    },
    {
      accessorKey: 'assignedTo',
      header: 'ASSIGNED TO',
      cell: ({ row }) => {
        const assigned = row.original.assignedTo;
        if (!assigned) {
          return (
            <div className="flex items-center gap-2 text-muted-foreground italic">
              <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px]">UN</div>
              Unassigned
            </div>
          );
        }
        // Mock manager names mapping based on ID
        const managerNames: Record<string, string> = { '2': 'Shivani L.', '3': 'Siddhi M.', '4': 'Basava K.' };
        const name = managerNames[assigned] || 'Admin';
        return (
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gray-800 text-white flex items-center justify-center text-[10px]">
              {name.charAt(0)}
            </div>
            <span className="font-medium text-sm">{name}</span>
          </div>
        );
      },
      filterFn: 'equalsString'
    },
    {
      accessorKey: 'createdAt',
      header: 'CREATED',
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span className="text-muted-foreground whitespace-nowrap">
          {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>;
      }
    },
    {
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100"
          onClick={() => navigate(`/customers/${row.original.id}`)}
        >
          View
        </Button>
      )
    }
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnFilters,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!user) return null;

  return (
    <AppLayout>
      <div className="space-y-6 pb-8">
        
        {/* Breadcrumb & Header */}
        <div>
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <span>Dashboard</span>
            <span className="mx-2">›</span>
            <span className="text-foreground font-medium">Customers</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Customer Management
            </h1>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="h-9 gap-2 bg-white">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              <Button 
                onClick={() => navigate('/customers/new')}
                className="h-9 gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>

        {/* Top Filters & Search */}
        <div className="bg-card rounded-t-xl border border-border p-4 flex flex-col md:flex-row gap-4 justify-between items-center border-b-0">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search customers..." 
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-muted/30 w-full"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Select
              className="w-[140px] h-9"
              value={(table.getColumn('status')?.getFilterValue() as string) ?? ''}
              onChange={e => table.getColumn('status')?.setFilterValue(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Closed">Closed</option>
            </Select>

            <Select
              className="w-[150px] h-9"
              value={(table.getColumn('eventType')?.getFilterValue() as string) ?? ''}
              onChange={e => table.getColumn('eventType')?.setFilterValue(e.target.value)}
            >
              <option value="">All Event Types</option>
              <option value="Marriage">Marriage</option>
              <option value="Birthday">Birthday</option>
              <option value="Corporate Event">Corporate</option>
            </Select>

            {user.role === 'Admin' && (
              <Select
                className="w-[160px] h-9"
                value={(table.getColumn('assignedTo')?.getFilterValue() as string) ?? ''}
                onChange={e => table.getColumn('assignedTo')?.setFilterValue(e.target.value)}
              >
                <option value="">All Managers</option>
                <option value="2">Shivani L.</option>
                <option value="3">Siddhi M.</option>
                <option value="4">Basava K.</option>
                <option value="unassigned">Unassigned</option>
              </Select>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-card border border-border rounded-b-xl overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id} className="bg-muted/30">
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="py-3">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}</span>-
              <span className="font-medium text-foreground">{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)}</span> of{' '}
              <span className="font-medium text-foreground">{table.getFilteredRowModel().rows.length}</span> customers
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                className="h-8 px-3 text-xs bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-3 w-3 mr-1" />
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[...Array(table.getPageCount())].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`h-7 w-7 rounded-md text-xs font-medium flex items-center justify-center ${
                      table.getState().pagination.pageIndex === i
                        ? 'bg-blue-600 text-white'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="h-8 px-3 text-xs bg-transparent border-transparent text-muted-foreground hover:bg-muted"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Leads</p>
                <h3 className="text-2xl font-bold tracking-tight">34</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold tracking-tight">52</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Converted</p>
                <h3 className="text-2xl font-bold tracking-tight">28</h3>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border shadow-sm">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <h3 className="text-2xl font-bold tracking-tight">24.5%</h3>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </AppLayout>
  );
};
