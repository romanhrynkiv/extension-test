import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  ReactDOM.render(<App />, document.getElementById('root'));
});

// chrome.storage.local.get(["secret", "password"], ({ secret, password }) => {
//   if (!secret) {
//     const newSecret = generateSecret();
//     chrome.storage.local.set({ secret: encrypt(newSecret) });
//     showPasswordForm();
//   } else if (!password) {
//     showPasswordForm();
//   } else {
//     showSecret();
//   }
// });

// function generateSecret() {
//   // TODO: Implement secret generation
// }

// function encrypt(secret) {
//   // TODO: Implement encryption
// }

// function showPasswordForm() {
//   // TODO: Implement password form
// }

// function showSecret() {
//   // TODO: Implement secret display
// }
// function showLoginForm() {
//   // TODO: Implement login form
// }

// function showRegenerateButton() {
//   // TODO: Implement regenerate button
// }

// function showLogoutButton() {
//   // TODO: Implement logout button
// }

// function logout() {
//   chrome.storage.local.remove(['secret', 'password']);
//   location.reload();
// }

// chrome.storage.local.get(['secret', 'password'], ({ secret, password }) => {
//   if (!secret || !password) {
//     showLoginForm();
//   } else {
//     showSecret();
//     showRegenerateButton();
//     showLogoutButton();
//   }
// });