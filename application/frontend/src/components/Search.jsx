import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [error, setError] = useState(null);

  // Fetch usernames from the backend as user types
  const fetchUsernames = async (searchTerm) => {
    try {
      setError(null); // Reset error state before fetching
      const response = await axios.get(`/api/users/?username=${searchTerm}`);

      // Check if response data is an array, else set an empty array
      if (Array.isArray(response.data)) {
        setFilteredUsernames(response.data);
      } else {
        console.error("Unexpected response structure:", response.data);
        setFilteredUsernames([]);
      }
    } catch (error) {
      console.error("Error fetching usernames:", error);
      setFilteredUsernames([]);
      setError("Failed to fetch usernames. Please try again.");
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    
    // Call API only if input is not empty
    if (value) {
      fetchUsernames(value);
    } else {
      setFilteredUsernames([]);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by username"
        value={inputValue}
        onChange={handleInputChange}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Only display <ul> if there are usernames to show */}
      {inputValue && filteredUsernames.length > 0 && (
        <ul>
          {filteredUsernames.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
