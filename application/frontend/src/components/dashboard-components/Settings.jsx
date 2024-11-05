import { useEffect, useState } from "react";
import Button from "../Button";

export default function Settings() {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);

  function formatKey(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, key[0].toUpperCase());
  }

  const handleSubmit = async () => {
    console.log("Update database and sessionStorage here");
  };

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    const settings = store.state.settings;
    setKeys(Object.keys(settings));
    setValues(Object.values(settings));
  }, []);

  return (
    <div className="settings">
      <h1>Settings</h1>
      <ul>
        {values.map((value, index) => (
          <li key={index} className="li-setting">
            <p>{formatKey(keys[index])}: </p>
            <input
              type="text"
              value={value}
              onChange={(e) => {
                const updatedValues = [...values];
                updatedValues[index] = e.target.value;
                setValues(updatedValues);
              }}
            />
          </li>
        ))}
      </ul>
      <Button text="Update" onClick={handleSubmit} />
    </div>
  );
}
