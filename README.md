# Performance Analytics Dashboard

A simple web app to analyze website performance using Google Chrome UX Report data. Built with React and Node.js.

## Features

- Analyze a single website
- Compare multiple websites
- Get performance scores and suggestions
- Export results as CSV, JSON, or text
- Mobile-friendly layout

## How it works

```
Frontend (React) <--> Backend (Node.js) <--> Google CrUX API
```

## Technologies

- React 18
- Material-UI for UI components
- Axios for requests
- Node.js and Express for backend
- Docker for deployment
- GitHub Actions for automation

## Setup

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Google API key (optional for demo)

### Steps

1. Clone the project:
   ```bash
   git clone https://github.com/your-username/crux-performance-analyzer.git
   cd crux-performance-analyzer
   ```

2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Configure environment:
   ```bash
   cp backend/env.example backend/.env
   ```
   Edit `backend/.env` to add your Google API key.

4. Run the app:
   ```bash
   npm start
   ```
   Open in your browser:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5001](http://localhost:5001)

### Using Docker

Build and run:
```bash
docker-compose up --build
```

Or build manually:
```bash
docker build -t crux-analyzer .
docker run -p 5001:5001 crux-analyzer
```

## Configuration

Create `.env` in `backend/`:
```env
GOOGLE_API_KEY=your-google-api-key
NODE_ENV=production
PORT=5001
FRONTEND_URL=http://localhost:3000
```

## How to Use

### Analyze Website

1. Go to "Single URL" tab
2. Enter website URL
3. Click "Analyze"
4. View score and suggestions
5. Export results if needed

### Compare Websites

1. Go to "Multiple URLs" tab
2. Enter multiple URLs
3. Click "Analyze All"
4. See comparison and insights
5. Export report

### Check Insights

- View overall performance
- Get tips to improve
- Compare multiple sites

## Testing

Run tests:
```bash
npm test
```
For backend:
```bash
cd backend && npm test
```
For frontend:
```bash
cd frontend && npm test
```

## Deployment

### Build for Production

```bash
npm run build
cd backend && npm start
```

### Docker in Production

```bash
docker build -t crux-analyzer:prod .
docker run -d -p 5001:5001 crux-analyzer:prod
```

## Project Structure

```
crux-performance-analyzer/
├── backend/        # Server code
├── frontend/       # UI code
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## Security

- Limits requests to prevent abuse
- Uses security headers
- Validates user input

## Contact

Feel free to contribute! Fork and create pull requests.

---

Let me know if you'd like me to add or clarify anything!