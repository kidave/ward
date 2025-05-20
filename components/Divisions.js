import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';

function Divisions() {
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [wards, setWards] = useState([]);
  const router = useRouter();

  const handleDivisionClick = async (divisionId) => {
    setSelectedDivision(divisionId);

    const { data, error } = await supabase
      .from('ward')
      .select('ward_id, ward_name')
      .eq('division_id', divisionId);

    if (error) {
      console.error('Error fetching wards:', error.message);
      setWards([]);
    } else {
      setWards(data);
    }
  };

  const goToWardDetail = (wardId) => {
    router.push(`/wards/${wardId}`);
  };

  return (
    <div>
      <div className="division-container">
        <button className="division-btn" onClick={() => handleDivisionClick(3)}>Eastern Suburb</button>
        <button className="division-btn" onClick={() => handleDivisionClick(1)}>Island City</button>
        <button className="division-btn" onClick={() => handleDivisionClick(2)}>Western Suburb</button>
      </div>

      <div className="ward-container">
        {wards.map((ward) => (
          <button
            key={ward.ward_id}
            className="ward-btn"
            onClick={() => goToWardDetail(ward.ward_id)}
          >
            {ward.ward_name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Divisions;
