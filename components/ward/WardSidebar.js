import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/layout/sidebar.module.css';
import buttonStyles from '../../styles/components/button.module.css';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import { IoFootsteps } from "react-icons/io5";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function WardSidebar({ 
  metrics, 
  error, 
  activeTab, 
  setActiveTab,
  disabledTabs = []
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  // State for ward selection
  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [wardsError, setWardsError] = useState(null);

  const isTabDisabled = (tab) => disabledTabs.includes(tab);

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 300) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Fetch all divisions on mount
  useEffect(() => {
    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      try {
        const { data, error } = await supabase
          .from('division')
          .select('division_id, division_name')
          .order('division_id', { ascending: true });
        if (error) throw error;
        setDivisions(data);
      } catch (err) {
        console.error('Error fetching divisions:', err);
      } finally {
        setLoadingDivisions(false);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch wards for the selected division
  useEffect(() => {
    if (!currentDivision) return;
    const fetchWards = async () => {
      setLoadingWards(true);
      setWardsError(null);
      try {
        const { data, error } = await supabase
          .from('ward')
          .select('ward_id, ward_name')
          .eq('division_id', currentDivision)
          .order('ward_name', { ascending: true });
        if (error) throw error;
        setWards(data);
        // Auto-select first ward if none selected
        if (data && data.length > 0 && !selectedWardId) {
          setSelectedWardId(data[0].ward_id);
          router.push(`/wards/${data[0].ward_id}`);
        }
      } catch (err) {
        setWardsError(err.message);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDivision]);

  // Set currentDivision and selectedWardId based on metrics.ward_id on mount or metrics change (for initial load)
  useEffect(() => {
    if (!metrics?.ward_id) return;
    const fetchDivisionForWard = async () => {
      try {
        const { data, error } = await supabase
          .from('ward')
          .select('division_id')
          .eq('ward_id', metrics.ward_id)
          .single();
        if (error) throw error;
        setCurrentDivision(data.division_id);
        setSelectedWardId(metrics.ward_id);
      } catch (err) {
        // fallback: do nothing
      }
    };
    fetchDivisionForWard();
  }, [metrics?.ward_id]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleDivisionChange = (divisionId) => {
    setCurrentDivision(divisionId);
    setWards([]);
    setSelectedWardId(null);
  };

  const handleWardChange = (wardId) => {
    setSelectedWardId(wardId);
    router.push(`/wards/${wardId}`);
  };

  return (
    <div 
      ref={sidebarRef}
      className={`${styles.leftSidebar} ${isCollapsed ? styles.collapsed : ''}`}
      style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
    >
      {/* Logo and toggle button */}
      <div className={styles.logoContainer} onClick={() => router.push('/')}>
        {!isCollapsed ? (
          <div className={styles.logoExpanded}>
            <IoFootsteps className={styles.logoIcon} />
            <span className={styles.logoText}>Walking Project</span>
          </div>
        ) : (
          <div className={styles.logoCollapsed}>
            <IoFootsteps className={styles.logoIcon} />
          </div>
        )}
      </div>

      <button 
        className={`${buttonStyles.toggle} ${isCollapsed ? buttonStyles.toggleCollapsed : ''}`}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FiChevronRight className={styles.logoIcon} /> : <FiChevronLeft className={styles.logoIcon} />}
      </button>

      {!isCollapsed && (
        <>
          <div className={styles.selector}>
            {/* Division Dropdown */}
            {loadingDivisions ? (
              <p>Loading divisions...</p>
            ) : (
              <select
                id="division-select"
                value={currentDivision || ''}
                onChange={e => handleDivisionChange(e.target.value)}
                className={styles.dropdown}
              >
                {divisions.map((division) => (
                  <option key={division.division_id} value={division.division_id}>
                    {division.division_name}
                  </option>
                ))}
              </select>
            )}
            {/* Ward Dropdown */}
            {loadingWards ? (
              <p>Loading wards...</p>
            ) : wardsError ? (
              <p style={{ color: 'red' }}>Error loading wards: {wardsError}</p>
            ) : (
              <select
                id="ward-select"
                value={selectedWardId || ''}
                onChange={e => handleWardChange(e.target.value)}
                className={styles.dropdown}
              >
                {wards.map((ward) => (
                  <option key={ward.ward_id} value={ward.ward_id}>
                    {ward.ward_name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tab buttons */}
          <div>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'timeline' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              Timeline
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'member' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('member')}
            >
              Member
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'road' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('road')}
            >
              Road
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'action' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('action')}
            >
              Action
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'junction' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('junction')}
              disabled={isTabDisabled('junction')}
            >
              Junction
            </button>
          </div>
        </>
      )}
    </div>
  );
}