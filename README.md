# MCSM - Minecraft Server Manager

A web-based minecraft server management utility built with Node, Express, and React. Includes tools for controlling the server instance, modifying configuration files, and viewing live system metrics. 


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
    * Download and install dependencies for the frontend client.
        ```sh
        cd frontend
        npm install
        ```
    * Download and install dependencies for the backend server .
        ```sh
        cd ../backend
        npm install
        ```
4. Run the Application
   * The backend server does not currently serve the React application. As a result, the react web development server must be started separately.
        
   * Start the frontend development server.
       * ```sh
         cd frontend
         npm start
   * Open a new terminal instance and start the backend server.
       * ```sh
         cd backend
         npm start
5. Open the application in your preferred web browser.
6. Default Login:
   * ```
     Username: admin
     Password: password
     ```
## Additional Notes
### Testing
This application has been tested with:
  -  Ubuntu 20.04 LTS
  -  EndeavourOS

### SECURITY 
This application is provided "as-is" and you are responsible for ensuring the application runs in a secure environment. This application has basic token-based authentication to limit unauthorized usage. However, this is not a guarantee for ensuring mitigating malicious attacks. 

### Why I created this project?
The primary motivation behind creating this project was to learn about React, Express, REST APIs, SQL/Relational Databases, and modern token-based authentication. This project was a great learning experience for learning about these technologies and how to approach various aspects of application development. 