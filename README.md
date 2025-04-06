# PassGuard - Password Manager

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Libraries/Tools Used](#librariestools-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Description
PassGuard is a web application designed to securely manage user passwords. It provides a seamless user experience by integrating modern libraries and tools for notifications, animations, validation, and responsive design. All passwords are securely stored in the browser's local storage.

## Features
- **Toast Notifications**: Real-time feedback for user actions using **Toastify**.
- **Animations**: Engaging animations powered by **Lottie**.
- **Real-Time Validation**: Input validation using **Regex** to ensure data integrity.
- **Password Management**: Securely save and manage passwords in the browser's local storage.
- **Responsive Design**: Built with **Tailwind CSS** for a modern and responsive UI.

## Libraries/Tools Used
1. **Toastify**: For creating toast notifications.
2. **Lottie**: For adding animations using JSON files.
3. **Regex**: For validating user input in real-time.
4. **MongoDB API**: For securely storing user passwords in the browser.
5. **Tailwind CSS**: For designing a responsive and visually appealing UI.

## Installation
1. Clone the repository:
   ```bash
   git clone {repository_url}
   ```
2. Navigate to the project directory:
   ```bash
   cd passwordmanager
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage
1. Open the application in your browser at `http://localhost:5173`.
2. Use the **Home** page to add new passwords.
3. Navigate to the **Edit** page to update existing passwords.
4. View saved passwords in the **About** section.

## Folder Structure
```
passwordmanager/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   ├── add-Animation.json
│   │   ├── check-animation.json
│   │   ├── contact-animation.json
│   │   ├── copy-animation.json
│   │   ├── react.svg
│   │   └── shield-animation.json
│   ├── components/
│   │   ├── Contact.jsx
│   │   ├── edit.jsx
│   │   ├── Home.jsx
│   │   ├── Lists.jsx
│   │   ├── Manager.jsx
│   │   └── Navbar.jsx
│   ├── contextprovider/
│   │   └── sessionprovider.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
└── vite.config.js
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
