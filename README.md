# Windows Installation Manual

![version](https://img.shields.io/badge/version-1.0-blue.svg)

## Table of Contents

- [Versions](#versions)
- [Installation Process](#installation-process)
- [Server Configuration (API)](#server-configuration-api)
- [Client Configuration](#client-configuration)
- [Resources](#resources)


## Installation Process

1. Clone, fork, or manually download the project.

2. If you do not have Node.js and/or npm installed, you need to install these tools by visiting the official Node.js website at [https://nodejs.org/en](https://nodejs.org/en) and clicking on "Download Node.js (LTS)".
    - Ensure both Node.js and npm are installed. To verify, open a Command Prompt or PowerShell and run `node -v` and `npm -v` to return the installed versions.

3. From this point, we recommend having two terminals (Command Prompt or PowerShell) open: one for the client application and one for the server application (API). Open the terminals and navigate to the project folder.

## Server Configuration (API)

1. In the terminal for the server, navigate to the project folder, then to the "Server" folder.

2. Run the command `npm install` to install all project dependencies.

3. In the project directory within the Server folder (`project/Server/`), create a `.env` file and add the following content (copy these values):

    ```
    PORT = 
    SECRET=
    # Database credentials
    PGHOST=''
    PGDATABASE=''
    PGUSER=''
    PGPASSWORD=''
    ENDPOINT_ID=''
    # Email Credentials
    EMAILFROM = ''
    EMAILPASSWORD = ''
    # Supabase
    SUPABASEURL = ''
    SUPABASEKEY = ''
    ```

    Note: Ensure the `.env` file has no extension other than `.env`, e.g., `.env.txt` (if it has an extension, the application will not work).

4. In the server terminal, run the command `node server.js`. If the output is "Server is running on 8003", it means the API is now functional and ready to receive communications on port 8003.

## Client Configuration

1. In the terminal for the client, navigate to the project folder, then to the "Client" folder.

2. Run the command `npm install` to install all client project dependencies including React. (This step may take a few minutes.)

3. After all dependencies are installed, to run the application, execute the command `npm start dev`. This command will compile all the code and automatically open the default browser with the site.


## Versions

| Version | Description |
| ------- | ----------- |
| 1.0     | Initial release |


## Resources

- [Node.js Official Page](https://nodejs.org/en/download/)


## Reporting Issues

We use GitHub Issues as the official bug tracker for this project. Here are some tips for our users who want to report an issue:

1. Make sure you are using the latest version of the project.
2. Providing reproducible steps for the issue will shorten the time it takes for it to be fixed.
3. Some issues may be browser-specific, so specifying which browser you encountered the issue in might help.

## Technical Support or Questions

If you have questions or need help integrating the product, please feel free to send us an email to cmsual2024@outlook.com




