'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import WardHeader from '../../components/ward/WardHeader';
import WardSidebar from '../../components/ward/WardSidebar';
import WardContent from '../../components/ward/WardContent';
import styles from '../../styles/layout/container.module.css';

export default function WardDetail() {
  const params = useParams();
  const router = useRouter();
  const wardId = params?.wardId;

  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('member');
  const [member, setMember] = useState([]);
  const [road, setRoad] = useState([]);
  const [action, setAction] = useState([]);
  const [junction, setJunction] = useState([]);
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

    if (activeTab === 'member') {
      const fetchMember = async () => {
        try {
          const { data, error } = await supabase
            .from('committee')
            .select('*')
            .eq('ward_id', wardId);

          if (error) throw error;
          console.log('Committee data:', data); // Debug log
          setMember(data);
        } catch (err) {
          console.error('Error fetching committee:', err);
          setError(err.message);
        }
      };

      fetchMember();

    } else if (activeTab === 'road') {
      const fetchRoad = async () => {
        try {
          const { data, error } = await supabase
            .from('major_roads_count')
            .select('*')
            .eq('ward_id', wardId)
            .neq('name', '')
            .order('name', { ascending: true });

          if (error) throw error;

          const uniqueRoad = Array.from(
            new Map(data.map((road) => [road.name, road])).values()
          );
          setRoad(uniqueRoad);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchRoad();

    } else if (activeTab === 'action') {
      const fetchAction = async () => {
        try {
          const { data, error } = await supabase
            .from('action')
            .select('*')
            .eq('ward_id', wardId);

          if (error) throw error;
          setAction(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchAction();
    }
  }, [activeTab, wardId]);

  const handleRoadClick = (roadId) => {
    alert(`Clicked road name: ${roadId}`);
    setSelectedRoad(roadId);
    // router.push(`/road/${roadId}`); // Uncomment if you implement road page
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
        />
        <WardContent 
          activeTab={activeTab}
          member={member}
          action={action}
          road={road}
          junction={junction}

          onRoadClick={handleRoadClick}
        />
      </div>
    </div>
  );
}
