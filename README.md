# MCSM - Minecraft Server Manager

A web-based Minecraft server management utility built with Node, Express, and React. Includes tools for controlling the server instance, modifying configuration files, and viewing live system metrics.

## Getting Started

This project is still in early development and requires manual configuration for running the software.

### Prerequisites

- [NodeJS](https://nodejs.org/en/) 12.x or greater LTS.

### Installation

1. Clone the Repo.
   ```sh
   git clone https://github.com/czagrzebski/MCSM
   ```
2. Navigate to root directory of repo.
3. Install the required dependencies.
   - Download and install dependencies for the frontend client.
     ```sh
     cd frontend
     npm install
     ```
   - Download and install dependencies for the backend server .
     ```sh
     cd ../backend-server
     npm install
     ```
4. Create Access and Refresh Token Secrets for Authentication
   - In order to use token-based authentication, you must provide an access and refresh token secret. Included in this repo is a script to generate these for you. However, you must manually paste the output of the script into a .env file in the **backend-server** directory.
   - ```sh
      cd backend-server/lib
      node tokens.js
     ```
   - You should get the following output.
     ```sh
     ACCESS_TOKEN_SECRET=<generated access token>
     REFRESH_TOKEN_SECRET=<generated refresh token>
     ```
   - Copy the output to your clipboard.
   - Next, navigate back to the root of the **backend-server** folder.
   - In the **backend-server** directory, create a new file called **.env** 
   - Open the **.env** file and paste in the contents from the clipboard. (or store it as an environmental variable)
5. Run the Application
   - The backend server does not currently serve the React application. As a result, the react web development server must be started separately.
   - Start the frontend development server.
     - ```sh
       cd frontend
       npm start
       ```
   - Open a new terminal instance and start the backend server.
     - ```sh
       cd backend-server
       npm start
       ```
6. Open the application in your preferred web browser.
7. Default Login:
   - ```
     Username: admin
     Password: password
     ```

## Additional Notes

### Testing

This application has been tested with:

- Ubuntu 20.04 LTS
- EndeavourOS

### SECURITY

This application is provided "as-is" and you are responsible for ensuring the application runs in a secure environment. This application has basic token-based authentication to limit unauthorized usage. However, this is not a guarantee for mitigating malicious attacks.

### Why I created this project?

The primary motivation behind creating this project was to learn about React, Express, REST APIs, SQL/Relational Databases, and modern token-based authentication. This project was a great learning experience for learning about these technologies and how to approach various aspects of application development.

### Development

This application is still in early development and is not ready for release. The setup instructions for this software contains several steps that will be polished out in the future. 
