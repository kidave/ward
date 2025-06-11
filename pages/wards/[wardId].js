'use client';

import { useParams } from 'next/navigation';
import WardSidebar from '../../components/ward/WardSidebar';
import WardContent from '../../components/ward/WardContent';
import styles from '../../styles/layout/container.module.css';
import { useState } from 'react';

import {
  useWardMetrics,
  useWardMembers,
  useWardRoads,
  useWardActions,
  useWardTimeline,
} from '../../src/hooks';

import { WardProvider } from '../../src/context/WardContext';

export default function WardDetail() {
  const params = useParams();
  const wardId = params?.wardId;

  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedRoad, setSelectedRoad] = useState(null);

  // Data hooks
  const { metrics, error: metricsError, loading: metricsLoading } = useWardMetrics(wardId);
  const { members, error: membersError, loading: membersLoading } = useWardMembers(wardId, activeTab === 'member');
  const { roads, error: roadsError, loading: roadsLoading } = useWardRoads(wardId, activeTab === 'road');
  const { actions, error: actionsError, loading: actionsLoading } = useWardActions(wardId, activeTab === 'action');
  const { timeline, wardInfo, error: timelineError, loading: timelineLoading } = useWardTimeline(wardId, activeTab === 'timeline');

  const error = metricsError || membersError || roadsError || actionsError || timelineError;
  const loading = metricsLoading || membersLoading || roadsLoading || actionsLoading || timelineLoading;

  return (
    <WardProvider wardId={wardId}> {/* ✅ */}
      <div className={styles.page}>
        <div className={styles.wardDetailMain}>
          <WardSidebar
            wardId={wardId} // ✅
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
            onRoadClick={setSelectedRoad}
            loading={loading}
            error={error}
            selectedRoad={selectedRoad}
          />
        </div>
      </div>
    </WardProvider>
  );
}
