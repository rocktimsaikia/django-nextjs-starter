FROM node:20.12-slim

# Set the working directory in the container
WORKDIR /main

# Install dependencies
COPY package.json pnpm-lock.yaml /main/
RUN npm install -g pnpm && pnpm install

# Copy the code into the container
COPY . /main/

# Expose the port the app runs on
EXPOSE 3000
