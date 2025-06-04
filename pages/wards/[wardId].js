'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import WardHeader from '../../components/ward/WardHeader';
import WardSidebar from '../../components/ward/WardSidebar';
import WardContent from '../../components/ward/WardContent';
import styles from '../../styles/layout/container.module.css';

import {
  useWardMetrics,
  useWardMembers,
  useWardRoads,
  useWardActions,
  useWardTimeline,
} from '../../src/hooks';

export default function WardDetail() {
  const params = useParams();
  const wardId = params?.wardId;

  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedRoad, setSelectedRoad] = useState(null);

  // Data fetching hooks
  const { metrics, error: metricsError, loading: metricsLoading } = useWardMetrics(wardId);
  const { members, error: membersError, loading: membersLoading } = useWardMembers(wardId, activeTab === 'member');
  const { roads, error: roadsError, loading: roadsLoading } = useWardRoads(wardId, activeTab === 'road');
  const { actions, error: actionsError, loading: actionsLoading } = useWardActions(wardId, activeTab === 'action');
  const { timeline, wardInfo, error: timelineError, loading: timelineLoading } = useWardTimeline(wardId, metrics?.ward_name, activeTab === 'timeline');

  // Centralized error and loading
  const error = metricsError || membersError || roadsError || actionsError || timelineError;
  const loading = metricsLoading || membersLoading || roadsLoading || actionsLoading || timelineLoading;

  const handleRoadClick = (roadId) => {
    alert(`Clicked road name: ${roadId}`);
    setSelectedRoad(roadId);
  };

  return (
    <div className={styles.page}>
      <WardHeader />
      <div className={styles.wardDetailMain}>
        <WardSidebar 
          metrics={metrics} 
          error={error} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          disabledTabs={['action', 'junction']}
        />
        <WardContent 
          activeTab={activeTab}
          timeline={timeline}
          action={actions}
          member={members}
          road={roads}
          wardInfo={wardInfo}
          onRoadClick={handleRoadClick}
          loading={loading}
          error={error}
          selectedRoad={selectedRoad}
        />
      </div>
    </div>
  );
}