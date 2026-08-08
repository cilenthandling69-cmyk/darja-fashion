# Start the Darja Fashion project

This project runs the React frontend and Express backend together from the
`darja-fashion` directory.

## Requirements

- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection string

## First-time setup

Open PowerShell in the `darja-fashion` directory and install the dependencies:

```powershell
npm.cmd install
npm.cmd install --prefix backend
npm.cmd install --prefix frontend
```

Create the environment files if they do not already exist:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Open `backend/.env` and replace these placeholder values:

```env
MONGO_URI=mongodb://127.0.0.1:27017/darja_fashion
JWT_SECRET=replace_with_a_long_random_secret
DEV_PASSWORD=replace_with_a_strong_password
```

Use your MongoDB Atlas URI for `MONGO_URI` if MongoDB is not installed locally.

Optionally add the sample products and developer account after MongoDB is
available:

```powershell
npm.cmd run seed
```

## Start the full project

From the `darja-fashion` directory, run:

```powershell
npm.cmd run dev
```

This starts both services in the same terminal:

- Storefront: http://localhost:5173
- Backend API: http://localhost:5000/api
- API health check: http://localhost:5000/api/health

Press `Ctrl+C` in the terminal to stop both services.

## Useful individual commands

```powershell
npm.cmd run server  # Backend only
npm.cmd run client  # Frontend only
npm.cmd run build   # Production frontend build
```

If PowerShell allows the `npm` command on your system, `npm` can be used in
place of `npm.cmd`.
