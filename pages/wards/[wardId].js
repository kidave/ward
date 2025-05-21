'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import styles from '../../styles/WardDetails.module.css'; // or use CSS module if preferred

export default function WardDetail() {
  const params = useParams();
  const router = useRouter();
  const wardId = params?.wardId;

  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('committees');
  const [members, setMembers] = useState([]);
  const [roads, setRoads] = useState([]);
  const [actions, setActions] = useState([]);
  const [junctions, setJunctions] = useState([]);
  const [selectedRoad, setSelectedRoad] = useState(null);
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    if (!wardId) return;

    const fetchMetrics = async () => {
      try {
        const { data, error } = await supabase
          .from('ward_dashboard_metrics')
          .select('*')
          .eq('ward_id', wardId)
          .single();

        if (error) throw error;
        setMetrics(data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchMetrics();
  }, [wardId]);

  useEffect(() => {
    if (!wardId) return;

    if (activeTab === 'committees') {
      const fetchMembers = async () => {
        try {
          const { data, error } = await supabase
            .from('committee')
            .select('*')
            .eq('ward_id', wardId);

          if (error) throw error;
          setMembers(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchMembers();

    } else if (activeTab === 'roads') {
      const fetchRoads = async () => {
        try {
          const { data, error } = await supabase
            .from('major_roads_count')
            .select('*')
            .eq('ward_id', wardId)
            .neq('name', '')
            .order('name', { ascending: true });

          if (error) throw error;

          const uniqueRoads = Array.from(
            new Map(data.map((road) => [road.name, road])).values()
          );
          setRoads(uniqueRoads);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchRoads();

    } else if (activeTab === 'actions') {
      const fetchActions = async () => {
        try {
          const { data, error } = await supabase
            .from('action')
            .select('*')
            .eq('ward_id', wardId);

          if (error) throw error;
          setActions(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchActions();
    }
  }, [activeTab, wardId]);

  const handleRoadClick = (roadId) => {
    alert(`Clicked road name: ${roadId}`);
    setSelectedRoad(roadId);
    // router.push(`/road/${roadId}`); // Uncomment if you implement road page
  };

  const toggleRow = (actionId) => {
    setExpandedRowId(expandedRowId === actionId ? null : actionId);
  };

  return (
    <div className={styles['ward-detail-container']}>
      {/* Header */}
      <div className={styles['ward-detail-header']}>
        <div className={styles['header-left']}>
          <img src="/wp_icon_sm.png" alt="Ward" className={styles["logo"]} />
          <h2>Ward Committee Dashboard</h2>
        </div>
        <button className={styles['home-button']} onClick={() => router.push('/')}>Home</button>
      </div>

      <div className={styles['ward-detail-main']}>
        {/* Sidebar */}
        <div className={styles['ward-sidebar']}>
          <div className={styles['ward-card']}>
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

          <div className={styles["ward-tabs"]}>
            <button
              className={`${styles['tab-button']} ${activeTab === 'committees' ? 'active' : ''}`}
              onClick={() => setActiveTab('committees')}
            >
              Member
            </button>
            <button
              className={`${styles['tab-button']} ${activeTab === 'actions' ? 'active' : ''}`}
              onClick={() => setActiveTab('actions')}
            >
              Action
            </button>
            <button
              className={`${styles['tab-button']} ${activeTab === 'outcomes' ? 'active' : ''}`}
              onClick={() => setActiveTab('outcomes')}
            >
              Outcome
            </button>
            <button
              className={`${styles['tab-button']} ${activeTab === 'roads' ? 'active' : ''}`}
              onClick={() => setActiveTab('roads')}
            >
              Road
            </button>
            <button
              className={`${styles['tab-button']} ${activeTab === 'junctions' ? 'active' : ''}`}
              onClick={() => setActiveTab('junctions')}
            >
              Junction
            </button>
          </div>
        </div>

        {/* Right Content */}
        <div className={styles["ward-content"]}>
          {activeTab === 'committees' && (
            <>
              <h3>Ward Members</h3>
              <div className={styles["members-list"]}>
                {members.length === 0 ? (
                  <p>No members found.</p>
                ) : (
                  members.map((member, i) => (
                    <div key={i} className={styles["member-card"]}>
                      {member.member_name}<br /><p />
                      <strong>Actions:</strong> {member.actions_taken}<br />
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'actions' && (
            <>
              <h3>Actions</h3>
              <div className={styles["actions-list"]}>
                {actions === null ? (
                  <p>Loading actions...</p>
                ) : actions.length === 0 ? (
                  <p>No actions found.</p>
                ) : (
                  <div className={`${styles["actions-wrapper"]}`}>
                    <table className={styles["actions-table"]}>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Description</th>
                          <th>Landmark Start</th>
                          <th>Landmark End</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Event Date</th>
                          <th>Reference Image</th>
                          {/* Add more columns as needed */}
                        </tr>
                      </thead>
                      <tbody>
                        {actions.map((action) => (
                          <tr key={action.action_id}>

                            <td>{action.action_type}</td>
                            <td>{action.description}</td>
                            <td>{action.landmark_start}</td>
                            <td>{action.landmark_end}</td>
                            <td>
                              <span className={`${styles.status} ${styles[action.status.toLowerCase()]}`}>
                                {action.status}
                              </span>
                            </td>
                            <td>
                              <span className={`${styles['priority-tag']} ${styles['priority-' + action.priority.toLowerCase()]}`}>
                                {action.priority}
                              </span>
                            </td>
                            <td>{new Date(action.event_date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'roads' && (
            <>
              <h3>List of Roads</h3>
              <div className={styles["roads-list"]}>
                {roads.length > 0 ? (
                  roads.map((road) => (
                    <button
                      key={road.id}
                      className={styles["road-button"]}
                      onClick={() => handleRoadClick(road.name)}
                    >
                      {road.name}
                    </button>
                  ))
                ) : (
                  <p>No roads found.</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
