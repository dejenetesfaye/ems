# Event Management System (EMS)

A full-stack MERN application for managing events with role-based access.

## Features

- **Super Admin**: Create and manage Managers and Supervisors
- **Manager**: Create events, manage resources, approve/reject requests
- **Bride (Client)**: View event details, send resource requests, confirm fulfillment
- **Supervisor**: View approved requests, fulfill them

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, Axios, React Router

## Setup

1. Install dependencies for backend and frontend:
   ```
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

2. Start MongoDB locally or update MONGO_URI in backend/.env

3. Start the backend:
   ```
   cd backend
   npm run dev
   ```

4. Start the frontend:
   ```
   cd frontend
   npm start
   ```

5. Access at http://localhost:3000

## API Endpoints

- POST /api/auth/login - Login
- POST /api/auth/register - Register (Super Admin only)
- GET /api/events/manager - Get manager's events
- POST /api/events - Create event
- GET /api/events/bride - Get bride's event
- POST /api/requests - Send request
- GET /api/requests/manager - Get requests for manager
- PUT /api/requests/:id/status - Approve/Reject request
- GET /api/requests/supervisor - Get approved requests
- PUT /api/requests/:id/fulfill - Fulfill request
- PUT /api/requests/:id/confirm - Confirm request

## Next Steps

- Add real-time updates with Socket.io
- Improve UI/UX
- Add more validations
- Implement cost calculations more robustly