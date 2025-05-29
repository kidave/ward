import { useState, useRef, useEffect } from 'react';
import styles from '../../styles/layout/sidebar.module.css';
import buttonStyles from '../../styles/components/button.module.css';
import cardStyles from '../../styles/components/card.module.css';

export default function WardSidebar({ 
  metrics, 
  error, 
  activeTab, 
  setActiveTab 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  // Handle sidebar resize
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 150 && newWidth < 400) {
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

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      ref={sidebarRef}
      className={`${styles.leftSidebar} ${isCollapsed ? styles.collapsed : ''}`}
      style={{ width: isCollapsed ? '50px' : `${sidebarWidth}px` }}
    >
      {/* Collapse/Expand Button - always visible */}
      <button 
        className={`${buttonStyles.toggle} ${isCollapsed ? buttonStyles.toggleCollapsed : ''}`}
        onClick={toggleSidebar}
      >
        {isCollapsed ? '→' : '←'}
      </button>

      {/* Content that should be hidden when collapsed */}
      {!isCollapsed && (
        <>
          {/* Resize Handle */}
          <div 
            className={buttonStyles.resizeHandle}
            onMouseDown={() => setIsResizing(true)}
          />

          <div className={cardStyles.metricBig}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {!metrics && !error && <p>Loading...</p>}
            {metrics && (
              <>
                <h3>{metrics.ward_name}</h3>
                <p>{metrics.total_roads} Actions Pending</p>
                <p>{metrics.total_members} Ward Members</p>
              </>
            )}
          </div>

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