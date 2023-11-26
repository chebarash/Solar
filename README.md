# Solar Plugin Backend
## Getting Started

To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/chebarash/Solar.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

### Build and launch

1. Setup environment following variables
   ```env
   APP_PORT=<port>
   BOT=<telegram bot token>
   ADMIN=<telegram chat id>
   DB_CONNECTION_STRING=<mongodb url>
   NODE_ENV=production
   ```
2. Build
   ```sh
   npm run build
   ```
3. Launch
   ```sh
   npm start
   ```
