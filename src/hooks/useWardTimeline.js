import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClient';

function formatDiscussionPoints(discussion) {
  if (!discussion) return [];
  return discussion.split(/\d+\./).filter(point => point.trim()).map(point => point.trim());
}

export default function useWardTimeline(wardId, wardName, enabled = true) {
  const [timeline, setTimeline] = useState([]);
  const [wardInfo, setWardInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!wardId || !enabled) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const { data: committeeData } = await supabase
          .from('committee')
          .select('*')
          .eq('ward_id', wardId)
          .eq('is_convenor', true)
          .single();

        const { data: coConvenorData } = await supabase
          .from('committee')
          .select('*')
          .eq('ward_id', wardId)
          .eq('is_co_convenor', true)
          .single();

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

        const combinedData = [
          ...(meeting?.map(meeting => ({
            id: `meeting-${meeting.meeting_id}`,
            type: 'meeting',
            date: new Date(meeting.meeting_date),
            title: meeting.meeting_title || 'Committee Meeting',
            location: meeting.meeting_location,
            attendees: meeting.notable_attendees,
            discussion: formatDiscussionPoints(meeting.discussion),
            mood: meeting.mood_rating,
            icon: '👥'
          })) || []),
          ...(update?.map(update => ({
            id: `update-${update.update_id}`,
            type: 'update',
            date: new Date(update.update_date),
            title: update.ward_name ? `${update.ward_name.trim()} Update` : 'Monthly Update',
            description: update.description,
            operation: update.operation,
            support: update.support,
            icon: '📅'
          })) || [])
        ].sort((a, b) => b.date - a.date);

        setTimeline(combinedData);

        setWardInfo({
          wardName: wardName || 'Unknown',
          convenor: committeeData?.member_name || 'Not assigned',
          coConvenor: coConvenorData?.member_name || 'Not assigned'
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    })();
  }, [wardId, wardName, enabled]);

  return { timeline, wardInfo, loading, error };
}