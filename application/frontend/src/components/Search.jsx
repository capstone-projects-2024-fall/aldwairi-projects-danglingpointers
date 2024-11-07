import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { HOST_PATH } from "../scripts/constants";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch usernames from the backend as user types
  const fetchUsernames = async (searchTerm) => {
    try {
      setError(null); // Reset error state before fetching
      const response = await axios.get(
        `${HOST_PATH}/users/?username=${searchTerm}`
      );

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
      setError("Failed to fetch usernames.");
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

  const handleUserClick = (username) => {
    setInputValue("");
    setFilteredUsernames([]);
    navigate(`/profile/${username}`);
  };

  return (
    <div className="search-container small-scrollbar">
      <span className="username-search">
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={handleInputChange}
        />
      </span>
      <div className="username-search-results-container">
        <ul className="username-search-results">
          {error && <li className="search-error">{error}</li>}
          {inputValue &&
            filteredUsernames.length > 0 &&
            filteredUsernames.map((user, index) => (
              <li key={index} onClick={() => handleUserClick(user.username)}>
                {user.username}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Search;
