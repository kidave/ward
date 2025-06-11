import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/layout/sidebar.module.css';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';
import { IoFootsteps } from "react-icons/io5";
import { FiClock, FiUsers, FiMap, FiCheckSquare, FiGitBranch, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function WardSidebar({ 
  wardId, 
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

  // Fetch division and set selected ward on first mount or URL change
  useEffect(() => {
    if (!wardId) return;

    const fetchDivisionForWard = async () => {
      try {
        const { data, error } = await supabase
          .from('ward')
          .select('division_id')
          .eq('ward_id', wardId)
          .single();

        if (error) throw error;
        setCurrentDivision(data.division_id);
        setSelectedWardId(wardId);
      } catch (err) {
        console.error('Error getting ward info:', err);
      }
    };

    fetchDivisionForWard();
  }, [wardId]);

  // Fetch wards when current division is set
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
        // Auto-select first ward if available
        if (data && data.length > 0) {
          setSelectedWardId(data[0].ward_id);
          router.push(`/wards/${data[0].ward_id}`);
        } else {
          setSelectedWardId(null);
        }
      } catch (err) {
        setWardsError(err.message);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [currentDivision]);

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
      style={{ width: isCollapsed ? '70px' : `${sidebarWidth}px` }}
    >
      {/* Logo and toggle button */}
      <div
        className={styles.logoContainer}
        onClick={() => router.push('/')}
        aria-label="Home"
        role="button"
        tabIndex={0}
        title="Home"
      >
        {!isCollapsed ? (
          <div className={styles.logoExpanded}>
            <img src="/wp_text_logo.png" alt="Ward" className={styles.logoText} />
          </div>
        ) : (
          <div className={styles.logoCollapsed}>
            <IoFootsteps className={styles.logoIcon} aria-label="Walking Project" />
          </div>
        )}
      </div>

      <button 
        className={`${styles.toggle} ${isCollapsed ? styles.toggle : ''}`}
        onClick={toggleSidebar}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <FiChevronRight className={styles.logoIcon} /> : <FiChevronLeft className={styles.logoIcon} />}
      </button>

      {!isCollapsed ? (
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
              <p>Error loading wards: {wardsError}</p>
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

          {/* Tab buttons (expanded) */}
          <div>
            <button
              className={`${styles.tab} ${activeTab === 'timeline' ? styles.active : ''}`}
              onClick={() => setActiveTab('timeline')}
            >
              <span className={styles.tabIcon}><FiClock /></span>
              <span className={styles.tabText}>Timeline</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'member' ? styles.active : ''}`}
              onClick={() => setActiveTab('member')}
            >
              <span className={styles.tabIcon}><FiUsers /></span>
              <span className={styles.tabText}>Member</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'road' ? styles.active : ''}`}
              onClick={() => setActiveTab('road')}
            >
              <span className={styles.tabIcon}><FiMap /></span>
              <span className={styles.tabText}>Road</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'action' ? styles.active : ''}`}
              onClick={() => setActiveTab('action')}
              disabled={isTabDisabled('action')}
            >
              <span className={styles.tabIcon}><FiCheckSquare /></span>
              <span className={styles.tabText}>Action</span>
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'junction' ? styles.active : ''}`}
              onClick={() => setActiveTab('junction')}
              disabled={isTabDisabled('junction')}
            >
              <span className={styles.tabIcon}><FiGitBranch /></span>
              <span className={styles.tabText}>Junction</span>
            </button>
          </div>
        </>
      ) : (
        // Collapsed: icon-only tab buttons
        <div className={styles.iconTabBar}>
          <button
            className={`${styles.tab} ${activeTab === 'timeline' ? styles.active : ''}`}
            onClick={() => setActiveTab('timeline')}
            title="Timeline"
          >
            <FiClock />
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'member' ? styles.active : ''}`}
            onClick={() => setActiveTab('member')}
            title="Member"
          >
            <FiUsers />
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'road' ? styles.active : ''}`}
            onClick={() => setActiveTab('road')}
            title="Road"
          >
            <FiMap />
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'action' ? styles.active : ''}`}
            onClick={() => setActiveTab('action')}
            disabled={isTabDisabled('action')}
            title="Action"
          >
            <FiCheckSquare />
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'junction' ? styles.active : ''}`}
            onClick={() => setActiveTab('junction')}
            disabled={isTabDisabled('junction')}
            title="Junction"
          >
            <FiGitBranch />
          </button>
        </div>
      )}
    </div>
  );
}