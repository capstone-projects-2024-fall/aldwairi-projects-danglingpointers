import { useEffect, useState } from "react";
import { SliderPicker } from "react-color";

export default function Settings() {
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [editSettings, setEditSettings] = useState(false);
  const [garbageCollectorColor, setGarbageCollectorColor] = useState();
  const [isListeningForKeyPress, setIsListeningForKeyPress] = useState(false);
  const [keyPressIndex, setKeyPressIndex] = useState();

  // Update camelCase format to Camel Case
  function formatKey(key) {
    return key.replace(/([A-Z])/g, " $1").replace(/^./, key[0].toUpperCase());
  }

  const handleEditSettings = async () => {
    if (editSettings) {
      const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
      const settings = store.state.settings;
      const keys = Object.keys(settings);
      values[0] = garbageCollectorColor;

      for (let i = 0; i < keys.length; i++) settings[keys[i]] = values[i];

      store.state.settings = settings;
      sessionStorage.setItem("user-metadata-state", JSON.stringify(store));
    }
    setEditSettings(!editSettings);
  };

  const handleChangeComplete = async (color) => {
    setGarbageCollectorColor(color.hex);
  };

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    const settings = store.state.settings;

    const sortedKeys = Object.keys(settings).sort();
    const sortedObject = {};

    sortedKeys.forEach((key) => {
      sortedObject[key] = settings[key];
    });

    setKeys(Object.keys(sortedObject));
    setValues(Object.values(sortedObject));
  }, []);

  useEffect(() => {
    setGarbageCollectorColor(values[0]);
  }, [values]);

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
      <ul>
        {values.map((value, index) => (
          <div key={index}>
            <li className="li-setting">
              <p>{formatKey(keys[index])}: </p>
              {editSettings ? (
                <input
                  className="no-cursor"
                  style={{
                    marginBottom: "10px",
                    width: "50%",
                    cursor: "default",
                    backgroundColor:
                      isListeningForKeyPress &&
                      keyPressIndex === index &&
                      keys[index] !== "garbageCollectorColor"
                        ? "#b3e6e2"
                        : "white",
                  }}
                  type="text"
                  value={
                    keys[index] === "garbageCollectorColor"
                      ? garbageCollectorColor
                      : isListeningForKeyPress && keyPressIndex === index
                      ? "Press any key or esc to cancel"
                      : value
                  }
                  onClick={() => {
                    setIsListeningForKeyPress(true);
                    setKeyPressIndex(index);
                  }}
                  onKeyDown={(e) => {
                    if (isListeningForKeyPress) {
                      if (e.key === "Escape") {
                        setIsListeningForKeyPress(false);
                        return;
                      }

                      let key = e.key === " " ? "Spacebar" : e.key;
                      if (values.includes(key) && values.indexOf(key) !== index)
                        return;

                      const updatedValues = [...values];
                      updatedValues[index] = key;

                      setValues(updatedValues);
                      setIsListeningForKeyPress(false);
                    }
                  }}
                />
              ) : (
                <input
                  style={{
                    marginBottom: "10px",
                    cursor: "default",
                    pointerEvents: "none",
                  }}
                  readOnly
                  type="text"
                  value={value}
                />
              )}
            </li>
            {editSettings && keys[index] === "garbageCollectorColor" ? (
              <li style={{ marginBottom: "10px" }}>
                <SliderPicker
                  key={100000}
                  color={garbageCollectorColor}
                  onChangeComplete={handleChangeComplete}
                />
              </li>
            ) : null}
          </div>
        ))}
      </ul>
    </div>
  );
}
