import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../utils/supabaseClient';

export function useSidebar(disabledTabs = []) {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const [divisions, setDivisions] = useState([]);
  const [wards, setWards] = useState([]);
  const [currentDivision, setCurrentDivision] = useState(null);
  const [selectedWardId, setSelectedWardId] = useState(null);
  const [loadingDivisions, setLoadingDivisions] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [wardsError, setWardsError] = useState(null);

  const isTabDisabled = (tab) => disabledTabs.includes(tab);
  const selectedWard = wards.find(w => String(w.id) === String(selectedWardId)) || null;

  // Sidebar resize logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth > 200 && newWidth < 300) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Fetch divisions
  useEffect(() => {
    const fetchDivisions = async () => {
      setLoadingDivisions(true);
      try {
        const { data, error } = await supabase
          .from('division')
          .select('id, division_name')
          .order('id', { ascending: true });
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

  // Auto-select first division
  useEffect(() => {
    if (divisions.length > 0 && !currentDivision) {
      setCurrentDivision(divisions[0].id);
    }
  }, [divisions, currentDivision]);

  // Fetch wards for selected division
  useEffect(() => {
    if (!currentDivision) return;
    const fetchWards = async () => {
      setLoadingWards(true);
      setWardsError(null);
      try {
        const { data, error } = await supabase
          .from('ward')
          .select('id, ward_name')
          .eq('division_id', currentDivision)
          .order('ward_name', { ascending: true });
        if (error) throw error;
        setWards(data || []);
      } catch (err) {
        setWardsError(err.message);
      } finally {
        setLoadingWards(false);
      }
    };
    fetchWards();
  }, [currentDivision]);

  // Auto-select first ward or use ward id from URL
  useEffect(() => {
    if (wards.length === 0) return;
    const pathWardId = router.query.wardId;
    if (pathWardId && wards.some(w => String(w.id) === String(pathWardId))) {
      setSelectedWardId(String(pathWardId));
    } else if (!selectedWardId) {
      setSelectedWardId(String(wards[0].id));
      router.push(`/wards/${wards[0].id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wards]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const handleDivisionChange = (divisionId) => {
    setCurrentDivision(divisionId);
    setWards([]);
    setSelectedWardId(null);
  };

  const handleWardChange = (wardId) => {
    setSelectedWardId(wardId);
    router.push(`/wards/${wardId}`);
  };

  return {
    isCollapsed,
    setIsCollapsed,
    sidebarWidth,
    setSidebarWidth,
    sidebarRef,
    isResizing,
    setIsResizing,
    divisions,
    wards,
    currentDivision,
    setCurrentDivision,
    selectedWardId,
    setSelectedWardId,
    loadingDivisions,
    loadingWards,
    wardsError,
    isTabDisabled,
    toggleSidebar,
    handleDivisionChange,
    handleWardChange,
    selectedWard
  };
}