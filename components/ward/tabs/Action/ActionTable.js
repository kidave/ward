import { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, ResizableColumn, Modal } from '../../../shared';
import ActionTableRow from './ActionTableRow';
import ActionTableFilters from './ActionTableFilters';
import tableStyles from '../../../../styles/components/table.module.css';
import cellStyles from '../../../../styles/components/cell.module.css';
import { supabase } from '../../../../utils/supabaseClient';

export default function ActionTable({ actions = [] }) {
  const [columnWidths, setColumnWidths] = useState({
    action_type: 150,
    description: 250,
    priority: 120,
    status: 120,
    event_date: 150,
    landmark_start: 150,
    landmark_end: 150,
    reference_image: 120
  });

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({
    action_type: '',
    description: '',
    priority: '',
    status: '',
    landmark_start: '',
    landmark_end: '',
  });




  const [enumOptions, setEnumOptions] = useState({
    action_type: ['pending', 'resolved', 'in progress', 'blocked'],
  });

  useEffect(() => {
    async function fetchEnums() {
      const enums = ['action_type'];
      const result = {};
      for (const col of enums) {
        const { data, error } = await supabase.rpc(`enum_values`, { table_name: 'action', column_name: col });
        if (!error) result[col] = data;        
      }
      setEnumOptions(result);
    }
    fetchEnums();
  }, []);

  const sortedItems = useMemo(() => {
    let sortableItems = [...actions];
    sortableItems = sortableItems.filter(item =>
      Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      })
    );
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (sortConfig.key === 'event_date') {
          return sortConfig.direction === 'asc'
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [actions, sortConfig, filters]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className={tableStyles.wrapper}>
      <ActionTableFilters
        filters={filters}
        enumOptions={enumOptions}
        onFilterChange={handleFilterChange}
      />
      <Modal
        isOpen={isImageModalOpen}
        imageUrl={selectedImage}
        onClose={() => setIsImageModalOpen(false)}
      />
      <Table className={tableStyles.Table}>
        <thead>
          <tr>
            <TableHeader width={columnWidths.event_date}>
              <div onClick={() => requestSort('event_date')}>
                Date
                {sortConfig.key === 'event_date' && (
                  <span>{sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}</span>
                )}
              </div>
              <ResizableColumn
                columnKey="event_date"
                currentWidth={columnWidths.event_date}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.action_type}>
              Type
              <ResizableColumn
                columnKey="action_type"
                currentWidth={columnWidths.action_type}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.description}>
              Description
              <ResizableColumn
                columnKey="description"
                currentWidth={columnWidths.description}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.status}>
              Status
              <ResizableColumn
                columnKey="status"
                currentWidth={columnWidths.status}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.landmark_start}>
              Landmark Start
              <ResizableColumn
                columnKey="landmark_start"
                currentWidth={columnWidths.landmark_start}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.landmark_end}>
              Landmark End
              <ResizableColumn
                columnKey="landmark_end"
                currentWidth={columnWidths.landmark_end}
                onResize={setColumnWidths}
              />
            </TableHeader>
            <TableHeader width={columnWidths.reference_image}>
              Reference Image
              <ResizableColumn
                columnKey="reference_image"
                currentWidth={columnWidths.reference_image}
                onResize={setColumnWidths}
              />
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {paginatedItems.map((action) => (
            <ActionTableRow
              key={action.action_id}
              action={action}
              setSelectedImage={setSelectedImage}
              setIsImageModalOpen={setIsImageModalOpen}
              cellStyles={cellStyles}
            />
          ))}
        </tbody>
      </Table>
      {/* Pagination controls can go here */}
    </div>
  );
}