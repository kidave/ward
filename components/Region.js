import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../utils/supabaseClient';
import containerStyles from '../styles/layout/container.module.css';
import buttonStyles from '../styles/components/button.module.css';

function Region() {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [wards, setWards] = useState([]);
  const router = useRouter();

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      const { data, error } = await supabase
        .from('city')
        .select('city_id, city_name')
        .order('city_id', { ascending: true });

      if (error) {
        console.error('Error fetching cities:', error.message);
      } else {
        setCities(data);
      }
    };

    fetchCities();
  }, []);

  // Fetch divisions when a city is selected
  const handleCityClick = async (cityId) => {
    setSelectedCity(cityId);
    setSelectedDivision(null);
    setWards([]);

    const { data, error } = await supabase
      .from('division')
      .select('division_id, division_name')
      .eq('city_id', cityId)
      .order('division_id', { ascending: true });

    if (error) {
      console.error('Error fetching divisions:', error.message);
      setDivisions([]);
    } else {
      setDivisions(data);
    }
  };

  // Fetch wards when a division is selected
  const handleDivisionClick = async (divisionId) => {
    setSelectedDivision(divisionId);

    const { data, error } = await supabase
      .from('ward')
      .select('ward_id, ward_name')
      .eq('division_id', divisionId)
      .order('ward_name', { ascending: true });

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
    <div className={containerStyles.regionContainer}>
      {/* Cities */}
      <div className={containerStyles.cityContainer}>
        {cities.map((city) => (
          <button
            key={city.city_id}
            className={`${buttonStyles.btnBig} ${
              selectedCity === city.city_id ? buttonStyles.active : ''
            }`}
            onClick={() => handleCityClick(city.city_id)}
          >
            {city.city_name}
          </button>
        ))}
      </div>

      {/* Divisions */}
      {selectedCity && (
        <div className={containerStyles.divisionContainer}>
          {divisions.map((division) => (
            <button
              key={division.division_id}
              className={`${buttonStyles.btnMedium} ${
                selectedDivision === division.division_id ? buttonStyles.active : ''
              }`}
              onClick={() => handleDivisionClick(division.division_id)}
            >
              {division.division_name}
            </button>
          ))}
        </div>
      )}

      {/* Wards */}
      {selectedDivision && (
        <div className={containerStyles.wardContainer}>
          {wards.map((ward) => (
            <button
              key={ward.ward_id}
              className={buttonStyles.btnSmall}
              onClick={() => goToWardDetail(ward.ward_id)}
            >
              {ward.ward_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Region;
