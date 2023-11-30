# Use an official Node.js runtime as a parent image
FROM node:13.12.0

# Set the working directory in the container to /app
WORKDIR /app

# Add `/app/node_modules/.bin` to the $PATH environment variable
ENV PATH /app/node_modules/.bin:$PATH

# Copy the package.json and package-lock.json files into the container
COPY package*.json ./

# Install project dependencies, including TypeScript, with npm
RUN npm install --silent

# Install react-scripts globally
RUN npm install react-scripts@3.4.1 -g --silent

# Copy the entire project into the container
COPY . ./

# Start the application using npm start
CMD ["npm", "start"]
