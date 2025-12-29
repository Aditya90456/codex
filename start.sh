#!/bin/bash

echo "Starting Codex Playground..."
echo

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo
echo "Starting backend server..."
npm run dev &
BACKEND_PID=$!

echo "Backend started with PID: $BACKEND_PID"
echo "Waiting for backend to start..."
sleep 3

cd ..
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

echo "Frontend started with PID: $FRONTEND_PID"
echo
echo "Codex Playground is running!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:3001"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user interrupt
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID; exit' INT
wait