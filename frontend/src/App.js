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

  // Reset charges when any input changes and handle type conversion for numbers
  const handleInputChange =
    (setter, isNumber = false) =>
    (e) => {
      const value = isNumber ? parseFloat(e.target.value) : e.target.value;
      setter(value);
      setCharges(null);
    };

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate required fields and handle 0 children
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

    try {
      const apiUrl = `${process.env.API_BASE_URL}/insurance_prediction`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setCharges(data.prediction.toFixed(2));
    } catch (error) {
      console.error("Error fetching charges:", error);
      setCharges("Error calculating charges");
    }
  };

  return (
    <div className='App'>
      <h2 className='title' style={{ fontSize: 30 }}>
        Medical Insurance Cost Prediction
      </h2>

      {/* Age Input */}
      <label className='title'>Enter Age:</label>
      <input
        type='number'
        value={age}
        onChange={handleInputChange(setAge, true)}
        placeholder='30'
      />

      {/* Gender Selection */}
      <label className='title'>Select Gender:</label>
      <select
        id='gender'
        value={gender}
        onChange={handleInputChange(setGender)}
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
      />

      {/* Number of Children Selection */}
      <label className='title'>Number of Children:</label>
      <select
        id='children'
        value={children}
        onChange={handleInputChange(setChildren, true)}
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
      >
        <option value=''>--Please choose an option--</option>
        {regionOptions.map((reg) => (
          <option key={reg} value={reg}>
            {reg.charAt(0).toUpperCase() + reg.slice(1)}
          </option>
        ))}
      </select>

      {/* Submit Button with Styling */}
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          color: "#fff",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Calculate Insurance Cost
      </button>

      {/* Display Charges */}
      {charges !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Predicted Charges: ${charges}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
