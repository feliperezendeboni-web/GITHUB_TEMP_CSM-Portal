# CSM Customer Portal - POC

This project is a Proof of Concept (POC) for the Customer Success Customer Portal. It supports both a specialized "Shared Server" mode (for data persistence across users) and a "Local" mode (fallback).

## Prerequisites
To use the Shared Server features (so multiple users see the same data), you must have **Node.js** installed.

1.  **Download Node.js**: [https://nodejs.org/](https://nodejs.org/) (Download the LTS version).
2.  **Install**: Run the installer and follow the default prompts.

## How to Run (Shared Server Mode)
Once Node.js is installed:

1.  Open a terminal (Command Prompt or PowerShell) in this project folder:
    `c:\Users\AYX106021\OneDrive - alteryx.com\Desktop\Black Belt\CSM Innovation - CS Customer Portal Paid Accounts\CSM Innovation - CS Customer Portal Paid Accounts`
2.  Install dependencies (first time only):
    ```powershell
    npm install
    ```
3.  Start the server:
    ```powershell
    npm start
    ```
4.  Open your browser to:
    [http://localhost:3000](http://localhost:3000)

## How to Run (Offline / Local Mode)
If you cannot install Node.js or the server is offline:
1.  Simply open `index.html` in your browser.
2.  You will see an "Offline Mode" warning.
3.  The application will function using your browser's Local Storage (data is not shared with others).

## Project Structure
- `server.js`: The lightweight backend server.
- `data/db.json`: The database file where project data is stored.
- `js/dataService.js`: Handles data synchronization (Server vs Local).
