# NeXeonSystems-Website-Monitor

## Description

**NeXeonSystems-Website-Monitor** is a real-time website monitoring system designed to keep track of the health and status of websites and services. It checks whether websites are up or down and provides an intuitive interface to display this status in real-time. The tool uses a client-server architecture with WebSockets for live updates, offering a seamless experience for website administrators to monitor their sites efficiently.

## Features

- **Real-time status updates** for each monitored website
- **Website name, status (up/down), and indicators** with color codes (green for up, red for down)
- **Easy setup and configuration** via a `config.json` file
- **Mobile-responsive UI** for accessibility across all devices
- **Socket.IO** integration for live updates without page refreshes
- **Monitoring of multiple websites** with a scalable, easy-to-use interface

## Tech Stack

- **Frontend:**
  - HTML
  - CSS (Responsive Grid Layout)
  - JavaScript (Socket.IO for real-time updates)
  
- **Backend:**
  - Node.js
  - Express
  
- **Real-time Communication:**
  - Socket.IO
  
- **Web Monitoring:**
  - Axios (for HTTP requests to check the status of websites)

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org) (version 14 or higher)
- [npm](https://www.npmjs.com/)

### Clone the Repository

Start by cloning the repository to your local machine:

```bash
git clone https://github.com/NeXeonSystems/NeXeonSystems-Website-Monitor.git
cd NeXeonSystems-Website-Monitor
```

### Install Dependencies

Run the following command to install all required dependencies:

```bash
npm install
```

### Add Sites to Monitor

The monitored sites are configured in the `config.json` file. 

1. Open `config.json` in your project folder.
2. It will look like this by default:

```json
{
  "Sites": [
    { "name": "", "domain": "", "port":  }
  ]
}
```

3. Add your own websites by filling in the `"name"`, `"domain"`, and `"port"` fields.

For example:

```json
{
  "Sites": [
    { "name": "Example", "domain": "example.com", "port": 80 },
    { "name": "Example2", "domain": "example2.com", "port": 8080 }
  ]
}
```

Once you've added your websites, the system will monitor them and display their status on the front-end.

### Running the Application

Start the application with the following command:

```bash
npm start
```

This will run the server, and you can access the monitoring dashboard in your browser by navigating to `http://localhost:3000`.

The status page will show:

- **Green** (up) if the website is online and accessible.
- **Red** (down) if the website is offline or unreachable.

## Example Output

Once everything is set up and the sites are running, your site monitor page will look like this:

![Example Monitor](https://i.imgur.com/V3C1jb3.png)

- Green circle for sites that are **up**.
- Red circle for sites that are **down**.

## Improvements

### Latest Updates

- **v1.0.0** (November 9, 2024): Added real-time status monitor with a nice CSS.

---------------------------------------------------
All copyrights goes to NeXeonSystems & Nethuka 2024
---------------------------------------------------
