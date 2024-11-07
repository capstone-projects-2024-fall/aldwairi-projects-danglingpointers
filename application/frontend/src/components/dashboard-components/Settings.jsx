import { useContext, useEffect, useState } from "react";
import AuthContext from "../../auth/AuthContext";
import { SliderPicker } from "react-color";

export default function Settings() {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const { garbageCollectorColor, setGarbageCollectorColor } =
    useContext(AuthContext);

  function formatKey(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, key[0].toUpperCase());
  }

  const handleChangeComplete = async (color) => {
    setGarbageCollectorColor(color.hex);
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
      <ul style={{ marginBottom: "20px" }}>
        {values.map((value, index) => (
          <>
            <li key={index} className="li-setting">
              <p>{formatKey(keys[index])}: </p>
              <input
                readOnly
                style={
                  keys[index] === "garbageCollectorColor"
                    ? { marginBottom: "20px", cursor: "default" }
                    : { cursor: "default" }
                }
                type="text"
                value={garbageCollectorColor}
                onChange={(e) => {
                  const updatedValues = [...values];
                  updatedValues[index] = e.target.value;
                  setValues(updatedValues);
                }}
              />
            </li>
            {keys[index] === "garbageCollectorColor" ? (
              <SliderPicker
                key={100000}
                color={garbageCollectorColor}
                onChangeComplete={handleChangeComplete}
              />
            ) : null}
          </>
        ))}
      </ul>
    </div>
  );
}
