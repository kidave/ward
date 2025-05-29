import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/layout/sidebar.module.css';
import buttonStyles from '../../styles/components/button.module.css';
import cardStyles from '../../styles/components/card.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

export default function WardSidebar({ 
  metrics, 
  error, 
  activeTab, 
  setActiveTab 
}) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // State for ward selection
  const [wards, setWards] = useState([]);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [loadingWards, setLoadingWards] = useState(false);
  const [wardsError, setWardsError] = useState(null);

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

  // Fetch wards for the current division
  useEffect(() => {
    if (!metrics?.ward_id) return;

    const fetchDivisionAndWards = async () => {
      setLoadingWards(true);
      setWardsError(null);
      
      try {
        // First get the division_id for the current ward
        const { data: wardData, error: wardError } = await supabase
          .from('ward')
          .select('division_id')
          .eq('ward_id', metrics.ward_id)
          .single();

        if (wardError) throw wardError;
        if (!wardData) return;

        // Then get all wards in that division
        const { data: wardsData, error: wardsError } = await supabase
          .from('ward')
          .select('ward_id, ward_name')
          .eq('division_id', wardData.division_id)
          .order('ward_name', { ascending: true });

        if (wardsError) throw wardsError;
        
        setWards(wardsData);
        setCurrentDivision(wardData.division_id);
      } catch (err) {
        console.error('Error fetching wards:', err);
        setWardsError(err.message);
      } finally {
        setLoadingWards(false);
      }
    };

    fetchDivisionAndWards();
  }, [metrics?.ward_id]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleWardChange = (wardId) => {
    router.push(`/wards/${wardId}`);
  };

  return (
    <div 
      ref={sidebarRef}
      className={`${styles.leftSidebar} ${isCollapsed ? styles.collapsed : ''}`}
      style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
    >
      {/* Logo and toggle button code remains the same */}
      <div className={styles.logoContainer} onClick={() => router.push('/')}>
        {!isCollapsed ? (
          <div className={styles.logoExpanded}>
            <Image 
              src="/footprint.png" 
              alt="App Logo" 
              width={30} 
              height={30}
              priority
            />
            <span className={styles.logoText}>Walking Project</span>
          </div>
        ) : (
          <div className={styles.logoCollapsed}>
            <Image 
              src="/footprint.png"
              alt="App Icon" 
              width={30} 
              height={30}
              priority
            />
          </div>
        )}
      </div>

      <button 
        className={`${buttonStyles.toggle} ${isCollapsed ? buttonStyles.toggleCollapsed : ''}`}
        onClick={toggleSidebar}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {!isCollapsed && (
        <>
          <div 
            className={buttonStyles.resizeHandle}
            onMouseDown={() => setIsResizing(true)}
          />

          <div className={cardStyles.metricBig}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!metrics && !error && <p>Loading...</p>}
            {metrics && (
              <>
                <div className={styles.selector}>
                  {loadingWards ? (
                    <p>Ward</p>
                  ) : wardsError ? (
                    <p style={{ color: 'red' }}>Error loading wards: {wardsError}</p>
                  ) : (
                    <select
                      id="ward-select"
                      value={metrics.ward_id}
                      onChange={(e) => handleWardChange(e.target.value)}
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
                <p>{metrics.total_roads} Actions Pending</p>
                <p>{metrics.total_members} Ward Members</p>
              </>
            )}
          </div>

          {/* Tab buttons remain the same */}
          <div>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'action' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('action')}
            >
              Action
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'member' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('member')}
            >
              Member
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'outcome' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('outcome')}
            >
              Outcome
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'road' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('road')}
            >
              Road
            </button>
            <button
              className={`${buttonStyles.tab} ${activeTab === 'junction' ? buttonStyles.active : ''}`}
              onClick={() => setActiveTab('junction')}
            >
              Junction
            </button>
          </div>
        </>
      )}
    </div>
  );
}