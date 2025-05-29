import { useEffect, useState } from 'react';
import styles from '../../../styles/layout/container.module.css';
import { supabase } from '../../../utils/supabaseClient';

export default function OutcomeTab({ wardCommittee }) {
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        setLoading(true);
        
        // Fetch meetings data in the new format
        const { data, error } = await supabase
          .from('meeting') // Adjust table name as needed
          .select('*')
          .eq('ward_name', wardCommittee)
          .order('meeting_date', { ascending: false });

        if (error) throw error;

        // Format the data for timeline
        const formattedData = data?.map(item => ({
          id: `meeting-${item.meeting_id}`,
          type: 'meeting',
          date: new Date(item.meeting_date),
          title: 'Committee Meeting',
          location: item.meeting_location,
          notableAttendees: item.notable_attendees,
          discussionPoints: parseDiscussionPoints(item.discussion),
          mood: item.mood_rating,
          icon: '👥'
        })) || [];

        setTimelineData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (wardCommittee) fetchTimelineData();
  }, [wardCommittee]);

  // Helper function to parse the discussion points string into an array
  const parseDiscussionPoints = (discussion) => {
    if (!discussion) return [];
    
    // Split by numbers followed by dots (e.g., "1.", "2.")
    const points = discussion.split(/\d+\./).filter(point => point.trim());
    return points.map(point => point.trim());
  };

  if (loading) return <div className={styles.wardContainer}>Loading timeline...</div>;
  if (error) return <div className={styles.wardContainer}>Error: {error}</div>;

  return (
    <div className={styles.wardContainer}>
      <h3>Ward Meeting Timeline</h3>
      {timelineData.length === 0 ? (
        <p>No meetings recorded yet for this ward</p>
      ) : (
        <div className={styles.timeline}>
          {timelineData.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineItem({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`${styles.timelineItem} ${expanded ? styles.expanded : ''}`}>
      <div className={styles.timelineMarker}>
        <span className={styles.icon}>{item.icon}</span>
      </div>
      <div className={styles.timelineContent}>
        <div className={styles.timelineHeader} onClick={() => setExpanded(!expanded)}>
          <h4>{item.title}</h4>
          <div className={styles.timelineMeta}>
            <span>{item.date.toLocaleDateString()}</span>
            {item.location && (
              <span className={styles.location}>📍 {item.location}</span>
            )}
            {item.mood && (
              <span className={styles.mood} title={`Mood rating: ${item.mood}/10`}>
                {Array.from({ length: item.mood }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </span>
            )}
          </div>
        </div>
        
        {expanded && (
          <div className={styles.timelineDetails}>
            {item.notableAttendees && (
              <>
                <h5>Notable Attendee:</h5>
                <div className={styles.personCard}>
                  {item.notableAttendees}
                </div>
              </>
            )}
            
            <h5>Discussion Points:</h5>
            <ul className={styles.discussionList}>
              {item.discussionPoints.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}