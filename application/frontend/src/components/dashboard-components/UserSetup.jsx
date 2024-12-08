import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";
import useUserMetaDataStore from "../../stores/userMetaDataStore";
import useUserAuthStore from "../../stores/userAuthStore";

export default function UserSetup({ setUserNeedsMetaData }) {
  const [securityQuestions, setSecurityQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState("0");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const { createUserMetaData } = useUserMetaDataStore();
  const { userId } = useUserAuthStore();

  useEffect(() => {
    const fetchSecurityQuestions = async () => {
      try {
        const response = await axios.get(`${HOST_PATH}/security-questions/`);
        const questions = [];
        for (const key in response.data) {
          questions.push(response.data[key].question);
        }

        setSecurityQuestions(questions);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSecurityQuestions();
  }, []);

  const handleSelectChange = (e) => {
    setSelectedQuestion(`${e.target.value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedQuestion || !securityAnswer) return;

    const formData = {
      user_id: userId,
      security_question: selectedQuestion,
      security_answer: securityAnswer,
    };

    try {
      await createUserMetaData(formData);
    } catch (error) {
      console.error(error);
    } finally {
      setUserNeedsMetaData(false);
    }
  };

  return (
    <main className="main-user-setup">
      <form onSubmit={handleSubmit}>
        <div className="user-setup-label-container">
          <label
            htmlFor="security-question"
            id="security-question"
            name="security-question"
          >
            Security Question:
          </label>
          <select value={selectedQuestion} onChange={handleSelectChange}>
            {securityQuestions.map((option, index) => (
              <option key={index} value={index}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="user-setup-label-container">
          <label
            htmlFor="security-answer"
            id="security-answer"
            name="security-answer"
          >
            Security Answer:
          </label>
          <input
            type="password"
            id="security-answer-input"
            placeholder="Enter your answer here"
            value={securityAnswer}
            onChange={(e) => setSecurityAnswer(e.target.value)}
          />
        </div>
        <button id="security-submit-button" type="submit">Submit</button>
      </form>
    </main>
  );
}
