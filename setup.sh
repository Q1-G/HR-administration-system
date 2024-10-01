#!/bin/bash

# Check for Node.js installation
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install it from https://nodejs.org/"
    exit
fi

# Check for npm installation
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install it from https://nodejs.org/"
    exit
fi

# Install dependencies
npm install

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev

echo "Setup complete! You can now access the application at http://localhost:3000"