#!/bin/bash

echo "🔍 Checking for processes using ports 8080 (backend) and 5173 (frontend)..."

# Kill any process using port 8080 (backend)
cmd.exe /c "netstat -ano | findstr :8080" > tmp_8080.txt
if [ -s tmp_8080.txt ]; then
    cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F"
fi
rm -f tmp_8080.txt

# Kill any process using port 5173 (frontend)
cmd.exe /c "netstat -ano | findstr :5173" > tmp_5173.txt
if [ -s tmp_5173.txt ]; then
    cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :5173') do taskkill /PID %a /F"
fi
rm -f tmp_5173.txt

sleep 2  # Allow time for the processes to terminate

echo "🚀 Starting backend in a new terminal..."
cmd.exe /c "start cmd /k cd /d C:\Project\E-Booking-System-Project\backend ^&^& java -jar target\movieapp-0.0.1-SNAPSHOT.jar"

sleep 5  # Give backend time to start

echo "🚀 Starting frontend in a new terminal..."
cmd.exe /c "start cmd /k cd /d C:\Project\E-Booking-System-Project\frontend ^&^& npm run dev"

sleep 5  # Give frontend time to start

echo "🌐 Opening browser at http://localhost:5173/"
cmd.exe /c "start http://localhost:5173/"

echo "✅ All services started successfully!"
