import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Search = () => {
  const [inputValue, setInputValue] = useState('');
  const [filteredUsernames, setFilteredUsernames] = useState([]);

  // Fetch usernames from the backend as user types
  const fetchUsernames = async (searchTerm) => {
    try {
      const response = await axios.get(`/api/users/?username=${searchTerm}`);
      setFilteredUsernames(response.data);
    } catch (error) {
      console.error("Error fetching usernames:", error);
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
      {inputValue && (
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
