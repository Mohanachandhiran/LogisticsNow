# LogisticsNow

LogisticsNow is a modern web application built with React and Vite. It provides a robust interface for logistics management, complete with data visualizations and smooth animations.

## Features

- ⚡️ **Fast Development**: Powered by Vite and React for ultra-fast Hot Module Replacement (HMR).
- 🎨 **Modern Styling**: Styled with Tailwind CSS for a highly customizable and responsive design.
- 📉 **Data Visualizations**: Integrated with Recharts for powerful charting and data representation.
- ✨ **Animations**: Smooth UI transitions and animations using Framer Motion.
- 🗺️ **Routing**: Seamless navigation with React Router DOM.
- 🧩 **Icons**: Beautiful and consistent iconography provided by Lucide React.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [Python 3.8+](https://www.python.org/) (for the backend)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Mohanachandhiran/LogisticsNow
   ```

2. Navigate into the project directory:
   ```bash
   cd LogisticsNow
   ```

### Running the Backend

The project uses a Flask backend. You need to start it separately.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

The backend server will run at `http://localhost:5000`.

### Running the Frontend

To start the React development server, open a new terminal in the root `LogisticsNow` directory and run:

1. Install frontend dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend application will be accessible at `http://localhost:5173/` by default.

### Building for Production

To create a production-ready build, run:

```bash
npm run build
```

This will generate an optimized build in the `dist` directory. To preview the production build locally, run:

```bash
npm run preview
```

## Linting

To check your code for stylistic and functional errors with ESLint, run:

```bash
npm run lint
```

## Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [React Router DOM](https://reactrouter.com/)
