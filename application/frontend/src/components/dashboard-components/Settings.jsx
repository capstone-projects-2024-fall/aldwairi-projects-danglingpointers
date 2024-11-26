import { useEffect, useState } from "react";
import { SliderPicker } from "react-color";

export default function Settings() {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [editSettings, setEditSettings] = useState(false);
  const [garbageCollectorColor, setGarbageCollectorColor] = useState();

  // Update camelCase format to Camel Case
  function formatKey(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, key[0].toUpperCase());
  }

  const handleEditSettings = async () => {
    setEditSettings(!editSettings);
  };

  const handleChangeComplete = async (color) => {
    setGarbageCollectorColor(color.hex);
  };

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    const settings = store.state.settings;
    const values = Object.values(settings);
    setKeys(Object.keys(settings));
    setValues(values);
    setGarbageCollectorColor(values[0]);
  }, []);

  return (
    <div className="settings">
      <div className="settings-header flex-row-container">
        <h1>Settings</h1>
        <button
          style={{
            color: "white",
            height: "40px",
            width: "65px",
            padding: "10px",
            backgroundColor: `${editSettings ? "green" : "blue"}`,
          }}
          onClick={handleEditSettings}
        >
          {editSettings ? "Save" : "Edit"}
        </button>
      </div>
      <ul style={{ marginBottom: "20px" }}>
        {values.map((value, index) => (
          <div key={index}>
            <li className="li-setting">
              <p>{formatKey(keys[index])}: </p>
              {editSettings ? (
                <input
                  style={{
                    marginBottom: "10px",
                  }}
                  type="text"
                  value={keys[index] === "garbageCollectorColor" ? garbageCollectorColor : value}
                  onChange={(e) => {
                    const updatedValues = [...values];
                    updatedValues[index] = e.target.value;
                    setValues(updatedValues);
                  }}
                />
              ) : (
                <input
                  style={{
                    marginBottom: "10px",
                    cursor: "default",
                  }}
                  readOnly
                  type="text"
                  value={value}
                  onChange={(e) => {
                    const updatedValues = [...values];
                    updatedValues[index] = e.target.value;
                    setValues(updatedValues);
                  }}
                />
              )}
            </li>
            {editSettings ? (
              <div style={{ marginBottom: "20px" }}>
                {keys[index] === "garbageCollectorColor" ? (
                  <SliderPicker
                    key={100000}
                    color={garbageCollectorColor}
                    onChangeComplete={handleChangeComplete}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </ul>
    </div>
  );
}
