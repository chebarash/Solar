FROM node:20.11.1

# Working dir
WORKDIR /usr/src/app

# Copy files from Build
COPY package*.json ./

# Install Files
RUN npm install 

# Copy SRC
COPY . .

# Build
RUN npm run build

# Open Port
EXPOSE 3000

# Docker Command to Start Service
CMD [ "npm", "start" ]
