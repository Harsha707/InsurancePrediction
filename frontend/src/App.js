import React, { useState } from "react";
import "./App.css";

const childrenOptions = [0, 1, 2, 3, 4, 5];
const regionOptions = ["southeast", "southwest", "northeast", "northwest"];
const smokerOptions = ["yes", "no"];

function App() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bmi, setBmi] = useState("");
  const [children, setChildren] = useState("");
  const [isSmoker, setIsSmoker] = useState("");
  const [region, setRegion] = useState("");
  const [charges, setCharges] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [initialRequest, setInitialRequest] = useState(true); // Track initial request

  const handleInputChange =
    (setter, isNumber = false) =>
    (e) => {
      const value = isNumber ? parseFloat(e.target.value) : e.target.value;
      setter(value);
      setCharges(null);
    };

  const handleSubmit = async () => {
    if (!age || !gender || !bmi || children === "" || !isSmoker || !region) {
      alert("Please fill in all the details before calculating the charges.");
      return;
    }

    const requestData = {
      age: Number(age),
      sex: gender,
      bmi: Number(bmi),
      children: Number(children),
      smoker: isSmoker,
      region,
    };

    setLoading(true);

    try {
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/insurance_prediction`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setCharges(data.prediction.toFixed(2));
      setInitialRequest(false); // Mark initial request as complete
    } catch (error) {
      console.error("Error fetching charges:", error);
      setCharges("Error calculating charges");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='App'>
      <h2
        className='title'
        style={{ fontSize: 30, fontFamily: "Arial, sans-serif", color: "#333" }}
      >
        Medical Insurance Cost Prediction
      </h2>

      {/* Age Input */}
      <label className='title'>Enter Age:</label>
      <input
        type='number'
        value={age}
        onChange={handleInputChange(setAge, true)}
        placeholder='30'
        className='input-field'
      />

      {/* Gender Selection */}
      <label className='title'>Select Gender:</label>
      <select
        id='gender'
        value={gender}
        onChange={handleInputChange(setGender)}
        className='dropdown'
      >
        <option value=''>--Please choose an option--</option>
        <option value='male'>Male</option>
        <option value='female'>Female</option>
      </select>

      {/* BMI Input */}
      <label className='title'>BMI:</label>
      <input
        type='number'
        value={bmi}
        onChange={handleInputChange(setBmi, true)}
        placeholder='27.99'
        className='input-field'
      />

      {/* Number of Children Selection */}
      <label className='title'>Number of Children:</label>
      <select
        id='children'
        value={children}
        onChange={handleInputChange(setChildren, true)}
        className='dropdown'
      >
        <option value=''>--Please choose an option--</option>
        {childrenOptions.map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>

      {/* Smoker Status */}
      <label className='title'>Are you a smoker?</label>
      <select
        id='smoker'
        value={isSmoker}
        onChange={handleInputChange(setIsSmoker)}
        className='dropdown'
      >
        <option value=''>--Please choose an option--</option>
        {smokerOptions.map((option) => (
          <option key={option} value={option}>
            {option === "yes" ? "Yes" : "No"}
          </option>
        ))}
      </select>

      {/* Region Selection */}
      <label className='title'>Select your region:</label>
      <select
        id='region'
        value={region}
        onChange={handleInputChange(setRegion)}
        className='dropdown'
      >
        <option value=''>--Please choose an option--</option>
        {regionOptions.map((reg) => (
          <option key={reg} value={reg}>
            {reg.charAt(0).toUpperCase() + reg.slice(1)}
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: loading ? "#ccc" : "#4CAF50",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Calculating..." : "Calculate Insurance Cost"}
      </button>

      {/* Loading Message */}
      {loading && initialRequest && (
        <div
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#555",
            fontStyle: "italic",
          }}
        >
          <p>
            Hang tight! This might take a moment as the system initializes the
            model and resources for the first request. Subsequent calculations
            will be much faster.
          </p>
        </div>
      )}

      {/* Display Charges */}
      {charges !== null && !loading && (
        <div style={{ marginTop: "20px" }}>
          <h3 style={{ color: "#333", fontFamily: "Arial, sans-serif" }}>
            Predicted Charges:{" "}
            <span style={{ color: "#4CAF50" }}>${charges}</span>
          </h3>
        </div>
      )}
    </div>
  );
}

export default App;
