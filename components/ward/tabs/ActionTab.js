import { useEffect, useState, useMemo } from 'react';
import { Table, TableHeader, TableCell, ResizableColumn } from '../../shared';
import tableStyles from '../../../styles/components/table.module.css';
import cellStyles from '../../../styles/components/cell.module.css';
import { supabase } from '../../../utils/supabaseClient';

export default function ActionTable({ actions = [] }) {
  // Column resizing state
  const [columnWidths, setColumnWidths] = useState({
    action_type: 150,
    description: 250,
    priority: 120,
    status: 120,
    event_date: 150,
    landmark_start: 150,
    landmark_end: 150,
    reference_image:120
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Filter state
  const [filters, setFilters] = useState({
    action_type: '',
    description: '',
    priority: '',
    status: '',
    event_date: '',
    landmark_start: '',
    landmark_end: '',
    reference_image: ''
  });

  const [enumOptions, setEnumOptions] = useState({
    action_type: [],
    priority: [],
    status: []
  });

  useEffect(() => {
    async function fetchEnums() {
      const enums = ['action_type', 'priority', 'status'];
      const result = {};

      for (const col of enums) {
        const { data, error } = await supabase.rpc(`enum_values`, { table_name: 'action', column_name: col });
        if (!error) result[col] = data;
      }

      setEnumOptions(result);
    }

    fetchEnums();
  }, []);


  // Apply sorting
  const sortedItems = useMemo(() => {
    let sortableItems = [...actions];
    
    // Apply filtering first
    sortableItems = sortableItems.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(item[key]).toLowerCase().includes(value.toLowerCase());
      });
    });

    // Then apply sorting
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle date comparison
        if (sortConfig.key === 'event_date') {
          return sortConfig.direction === 'asc' 
            ? new Date(aValue) - new Date(bValue)
            : new Date(bValue) - new Date(aValue);
        }
        
        // Handle string comparison
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
  }, [actions, sortConfig, filters]);

  // Sort request handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter change handler
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Add to your useMemo calculation:
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  
  const getPriorityClass = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return cellStyles.priorityHigh;
      case 'medium': return cellStyles.priorityMedium;
      case 'low': return cellStyles.priorityLow;
      case 'critical': return cellStyles.priorityCritical;
      default: return '';
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return cellStyles.statusPending;
      case 'resolved': return cellStyles.statusResolved;
      case 'in progress': return cellStyles.statusInProgress;
      case 'blocked': return cellStyles.statusBlocked;
      default: return '';
    }
  };

  const getImageUrl = (filename) => {
  if (!filename) return null;
  return `https://gostxgfnoilfmybaohhx.supabase.co/storage/v1/object/public/roads/${filename}`;
  };

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className={tableStyles.wrapper}>
      <div className={tableStyles.filters}>
        <select
          value={filters.action_type}
          onChange={(e) => handleFilterChange('action_type', e.target.value)}
          className={tableStyles.filterInput}
        >
          <option value="">Filter by Type</option>
          {(enumOptions.action_type || []).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by Description"
          value={filters.description}
          onChange={(e) => handleFilterChange('description', e.target.value)}
          className={tableStyles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by Priority"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className={tableStyles.filterInput}
        />
        <input
          type="text"
          placeholder="Filter by Status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={tableStyles.filterInput}
        />
        {isImageModalOpen && (
          <div className={tableStyles.imageModalOverlay} onClick={() => setIsImageModalOpen(false)}>
            <div className={tableStyles.imageModalContent} onClick={(e) => e.stopPropagation()}>
              <button 
                className={tableStyles.closeButton}
                onClick={() => setIsImageModalOpen(false)}
              >
                &times;
              </button>
              <img 
                src={`https://gostxgfnoilfmybaohhx.supabase.co/storage/v1/object/public/ward/${selectedImage}`} 
                alt="Reference" 
                className={tableStyles.modalImage}
              />
            </div>
          </div>
        )}
      </div>
      

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

            <TableHeader width={columnWidths.priority}>
              Priority
              <ResizableColumn 
                columnKey="priority" 
                currentWidth={columnWidths.priority}
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
          {sortedItems.map((action) => (
            <tr key={action.action_id}>
              <TableCell>{new Date(action.event_date).toLocaleDateString()}</TableCell>
              <TableCell>{action.action_type}</TableCell>
              <TableCell>{action.description}</TableCell>
              <TableCell>
                <span className={`${cellStyles.priorityTag} ${getPriorityClass(action.priority)}`}>
                  {action.priority}
                </span>
              </TableCell>
              <TableCell>
                <span className={`${cellStyles.statusTag} ${getStatusClass(action.status)}`}>
                  {action.status}
                </span>
              </TableCell>
              <TableCell>{action.landmark_start}</TableCell>
              <TableCell>{action.landmark_end}</TableCell>
              <TableCell>
                {action.reference_image ? (
                  <button 
                    className={tableStyles.imageButton}
                    onClick={() => {
                      setSelectedImage(action.reference_image);
                      setIsImageModalOpen(true);
                    }}
                  >
                    View Image
                  </button>
                ) : (
                  "No image"
                )}
              </TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}