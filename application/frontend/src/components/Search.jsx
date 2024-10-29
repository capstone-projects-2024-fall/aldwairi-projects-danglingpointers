import React, { useState } from 'react';

const Search = () => {
  //replace in future with actual list of usernames
  const [usernames] = useState([
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eve',
    'Frank'
  ]);
  
  // State for the input value and filtered results
  const [inputValue, setInputValue] = useState('');
  const [filteredUsernames, setFilteredUsernames] = useState([]);

  // Method to handle input changes and filter the list
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Filter usernames based on input value
    const filtered = usernames.filter(username =>
      username.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsernames(filtered);
  };

  return (
    <div>
      {/* Input for username */}
      <input
        type="text"
        placeholder="Search by username"
        value={inputValue}
        onChange={handleInputChange}
      />
      
      {/* Display filtered usernames */}
      {inputValue && (
        <ul>
          {filteredUsernames.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
