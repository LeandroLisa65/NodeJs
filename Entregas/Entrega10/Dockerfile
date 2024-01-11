# Base image
FROM node:20.8.0-alpine3.17

# Directory where the project is saved
WORKDIR /app

# Copy the package.json file
COPY package*.json ./src/app.js ./

# Execute the command to install dependencies
RUN npm config set strict-ssl false --global
RUN npm install -g npm@10.3.0

# Copy all the code
COPY . .

# The port to expose in our container
EXPOSE 8081

# Execute the command to start the app
CMD [ "npm", "start"]