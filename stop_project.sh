#!/bin/bash

echo "🔍 Finding and stopping backend (8080) and frontend (5173)..."

# Kill any process using port 8080 (backend)
cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :8080') do taskkill /PID %a /F"

# Kill any process using port 5173 (frontend)
cmd.exe /c "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :5173') do taskkill /PID %a /F"

sleep 2  # Allow time for processes to terminate

echo "✅ Backend and frontend have been stopped successfully!"
