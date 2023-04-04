import "./App.css";
import CryptoJS from "crypto-js";
import React, { useState, useEffect } from "react";

const App = () => {
  const [initialized, setInitialized] = useState(false);
  const [initPage, setInitPage] = useState(true);
  const [secret, setSecret] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["initialized"], (result) => {
      if (result.initialized) {
        setInitialized(true);
        chrome.storage.local.get(["secret"], (result) => {
          setSecret(result.secret);
        });
      } else {
        setSecret(generateSecret());
        setInitialized(false);
        setLoggedIn(false);
      }
    });
  }, []);

  useEffect(() => {
    console.log(password, "secret");
  }, [password]);

  const generateSecret = () => {
    const length = 16;
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (password) {
      chrome.storage.local.set({
        secret: result,
        initialized: true,
      });
      const encryptedSecret = encryptSecret(result, password);
      localStorage.setItem("secret", encryptedSecret);
    }

    return result;
  };

  const handleSetPassword = () => {
    if (password === confirmPassword) {
      const encryptedSecret = encryptSecret(secret, password);
      chrome.storage.local.set({ secret: secret, initialized: true });
      localStorage.setItem("secret", encryptedSecret);
      setInitialized(true);
    } else {
      alert("Passwords do not match.");
    }
  };

  const handleSignIn = () => {
    chrome.storage.local.get(["secret"], (result) => {
      console.log(result.secret);
      console.log(localStorage.getItem("secret"));
      const decryptedSecret = decryptSecret(
        localStorage.getItem("secret"),
        password
      );
      console.log(decryptedSecret);

      if (result.secret === decryptedSecret) {
        console.log("asdasdsa");
        setLoggedIn(true);
      } else {
        alert("Invalid password.");
      }
    });
  };

  const handleLogout = () => {
    setLoggedIn(false);
  };

  const handleReset = () => {
    chrome.storage.local.remove(["initialized", "secret"]);
    localStorage.clear();
    setInitialized(false);
    setInitPage(true);
    setSecret(generateSecret());
    setPassword("");
    setConfirmPassword("");
    setLoggedIn(false);
  };

  const encryptSecret = (secret, password) => {
    const encrypted = CryptoJS.AES.encrypt(secret, password).toString();
    return encrypted;
  };

  const decryptSecret = (encryptedSecret, password) => {
    const bytes = CryptoJS.AES.decrypt(encryptedSecret, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  };

  if (!initialized && initPage) {
    return (
      <div className="App">
        <p>{secret}</p>
        <button onClick={() => setInitPage(false)}>Next</button>
      </div>
    );
  } else if (!initialized && !initPage) {
    return (
      <div className="App">
        <h1>Extension Initialization</h1>
        <p>Please set a password to initialize the extension:</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSetPassword}>Set Password</button>
      </div>
    );
  } else if (!loggedIn) {
    return (
      <div className="App">
        <h1>Extension Login</h1>
        <p>Please enter your password:</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleReset}>Reset Extension</button>
      </div>
    );
  } else {
    return (
      <div className="App">
        <h1>Extension</h1>
        <p>Secret</p>
        <p>{secret}</p>
        <br />
        <button onClick={() => setSecret(generateSecret())}>
          Regenerate Secret
        </button>
        <br />
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }
};

export default App;
