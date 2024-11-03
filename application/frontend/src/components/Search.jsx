import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserProfileStore from "../stores/userProfileStore";
import axios from "axios";

const Search = () => {
  const [inputValue, setInputValue] = useState("");
  const [filteredUsernames, setFilteredUsernames] = useState([]);
  const [error, setError] = useState(null);
  const { setProfileId } = useUserProfileStore();
  const HOST_PATH = "http://localhost:8000/api";
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

  const handleUserClick = (userId) => {
    setProfileId(userId);
    setInputValue("");
    setFilteredUsernames([]);
    navigate("/profile");
  };

  return (
    <div className="search-container">
      <span className="username-search">
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onChange={handleInputChange}
        />
      </span>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Only display <ul> if there are usernames to show */}
      {inputValue && filteredUsernames.length > 0 && (
        <ul className="username-search-results">
          {filteredUsernames.map((user, index) => (
            <li key={index}>
              <button onClick={() => handleUserClick(user.id)}>
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
