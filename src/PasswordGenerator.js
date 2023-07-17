import React, { useState, useEffect } from "react";
import "./App.css";

const generatePassword = (
  length,
  includeNumbers,
  includeAlphabets,
  includeSpecialChars
) => {
  const numbers = "0123456789";
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialChars = "!@#$%^&*()-_=+[]{}|;:,.<>?";

  let charset = "";
  if (includeNumbers) charset += numbers;
  if (includeAlphabets) charset += alphabets;
  if (includeSpecialChars) charset += specialChars;

  // Generate the password
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [previousPasswords, setPreviousPasswords] = useState([]);
  const [fivePasswords, setFivePasswords] = useState([]);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeAlphabets, setIncludeAlphabets] = useState(true);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedPasswords =
      JSON.parse(localStorage.getItem("previousPasswords")) || [];
    setPreviousPasswords(storedPasswords);
  }, []);

  const handleGeneratePassword = () => {
    if (!includeNumbers && !includeAlphabets && !includeSpecialChars) {
      setError(
        "Please select at least one option (Numbers, Alphabets, or Special Characters)."
      );
      return;
    }

    setError("");
    const newPassword = generatePassword(
      12,
      includeNumbers,
      includeAlphabets,
      includeSpecialChars
    ); //Length 12
    setPassword(newPassword);
    setPreviousPasswords((prevPasswords) => [...prevPasswords, newPassword]);

    localStorage.setItem(
      "previousPasswords",
      JSON.stringify([...previousPasswords, newPassword])
    );

    const lastFivePasswords = [...previousPasswords].slice(-5);
    setFivePasswords(lastFivePasswords);
  };

  const handleCopyToClipboard = () => {
    // Copy the generated password to clipboard
    navigator.clipboard.writeText(password);
    alert("Password copied to clipboard!");
  };

  return (
    <div className="container mt-5 password-generator-container">
      <h1 className="text-center mb-4">Password Generator</h1>
      <div className="form-check mb-3 text-center">
        <input
          type="checkbox"
          className="form-check-input"
          id="includeNumbers"
          checked={includeNumbers}
          onChange={() => setIncludeNumbers(!includeNumbers)}
        />
        <label className="form-check-label" htmlFor="includeNumbers">
          Include Numbers
        </label>
      </div>
      <div className="form-check mb-3 text-center">
        <input
          type="checkbox"
          className="form-check-input"
          id="includeAlphabets"
          checked={includeAlphabets}
          onChange={() => setIncludeAlphabets(!includeAlphabets)}
        />
        <label className="form-check-label" htmlFor="includeAlphabets">
          Include Alphabets
        </label>
      </div>
      <div className="form-check mb-3 text-center">
        <input
          type="checkbox"
          className="form-check-input"
          id="includeSpecialChars"
          checked={includeSpecialChars}
          onChange={() => setIncludeSpecialChars(!includeSpecialChars)}
        />
        <label className="form-check-label" htmlFor="includeSpecialChars">
          Include Special Characters
        </label>
      </div>
      <div className="d-flex justify-content-center mb-3">
        <button
          className="btn btn-primary mr-2"
          onClick={handleGeneratePassword}
        >
          Generate Password
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCopyToClipboard}
          disabled={!password}
        >
          Copy to Clipboard
        </button>
      </div>
      <div className="generated-password text-center font-weight-bold mb-4">
        Generated Password: {password}
      </div>
      <div className="previous-passwords text-center">
        <strong>Last 5 Passwords:</strong>
        <ul className="list-unstyled">
          {fivePasswords.map((prevPassword, index) => (
            <li key={index}>{prevPassword}</li>
          ))}
        </ul>
      </div>
      {error && <div className="alert alert-danger text-center">{error}</div>}
    </div>
  );
};

export default PasswordGenerator;
