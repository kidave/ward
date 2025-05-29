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
  const [activeTab, setActiveTab] = useState('action');
  const [member, setMember] = useState([]);
  const [road, setRoad] = useState([]);
  const [action, setAction] = useState([]);
  const [junction, setJunction] = useState([]);
  const [outcome, setOutcome] = useState([]); // Added outcome state
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
          console.log('Committee data:', data);
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
    
    } else if (activeTab === 'outcome') {
      const fetchOutcome = async () => {
        try {
          // Fetch both meetings and updates data
          const { data: meeting, error: meetingError } = await supabase
            .from('meeting')
            .select('*')
            .eq('ward_id', wardId)
            .order('meeting_date', { ascending: false });

          const { data: update, error: updateError } = await supabase
            .from('update')
            .select('*')
            .eq('ward_id', wardId)
            .order('update_date', { ascending: false });

          if (meetingError || updateError) throw meetingError || updateError;

          // Combine and format the data
          const combinedData = [
            ...(meeting?.map(meeting => ({
              id: `meeting-${meeting.meeting_id}`,
              type: 'meeting',
              date: new Date(meeting.meeting_date),
              title: 'Committee Meeting',
              location: meeting.meeting_location,
              attendees: meeting.notable_attendees,
              discussion: formatDiscussionPoints(meeting.discussion),
              mood: meeting.mood_rating,
              icon: '👥'
            })) || []),
            ...(update?.map(update => ({
              id: `update-${update.id}`,
              type: 'update',
              date: new Date(update.date),
              title: 'Monthly Update',
              content: update.operations_updates,
              peopleMet: update.notable_meetings,
              issues: update.issues_needing_support,
              icon: '📅'
            })) || [])
          ].sort((a, b) => b.date - a.date);

          setOutcome(combinedData);
        } catch (err) {
          console.error('Error fetching outcome data:', err);
          setError(err.message);
        }
      };

      fetchOutcome();
    }
  }, [activeTab, wardId]);

  // Helper function to format discussion points
  const formatDiscussionPoints = (discussion) => {
    if (!discussion) return [];
    return discussion.split(/\d+\./).filter(point => point.trim()).map(point => point.trim());
  };

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
        />
        <WardContent 
          activeTab={activeTab}
          action={action}
          member={member}
          road={road}
          junction={junction}
          outcome={outcome}
          onRoadClick={handleRoadClick}
        />
      </div>
    </div>
  );
}