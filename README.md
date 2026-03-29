# Learnify 🎓

> Transform PDFs into AI-powered learning courses in seconds

An intelligent e-learning platform that uses AI to automatically generate structured courses from documents. Upload a PDF and get instant access to modules, lessons, quizzes, code snippets, and a personal AI tutor—all powered by advanced language models.

Install client dependencies

bash
cd client
npm install
Install server dependencies

bash
cd ../server
npm install
Setup Environment Variables
Create a .env file in the server directory:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
Create a .env.local file in the client directory (if needed):

env
VITE_API_URL=http://localhost:5000
Running the Application
Start the backend server:

bash
cd server
npm run dev
The API will be available at http://localhost:5000

In a new terminal, start the frontend:

bash
cd client
npm run dev
The client will be available at http://localhost:5173

Build for Production
Frontend:

bash
cd client
npm run build
Backend: The server runs as is; configure your hosting platform to use server/server.js as the entry point.
# Learnify 🎓

> Transform PDFs into AI-powered learning courses in seconds

An intelligent e-learning platform that uses AI to automatically generate structured courses from documents. Upload a PDF and get instant access to modules, lessons, quizzes, code snippets, and a personal AI tutor—all powered by advanced language models.

Install client dependencies

bash
cd client
npm install
Install server dependencies

bash
cd ../server
npm install
Setup Environment Variables
Create a .env file in the server directory:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
Create a .env.local file in the client directory (if needed):

env
VITE_API_URL=http://localhost:5000
Running the Application
Start the backend server:

bash
cd server
npm run dev
The API will be available at http://localhost:5000

In a new terminal, start the frontend:

bash
cd client
npm run dev
The client will be available at http://localhost:5173

Build for Production
Frontend:

bash
cd client
npm run build
Backend: The server runs as is; configure your hosting platform to use server/server.js as the entry point.

📁 Project Structure
Code
Learnify/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Home, Courses, CourseDashboard, etc.)
│   │   ├── components/    # Reusable UI components
│   │   ├── services/      # API integration
│   │   ├── store/         # State management (Zustand)
│   │   ├── app/           # App configuration and routing
│   │   ├── assets/        # Images and static files
│   │   ├── layout/        # Layout components
│   │   └── main.jsx       # React entry point
│   ├── vite.config.js     # Vite configuration
│   ├── tailwind.config.js # Tailwind CSS config
│   └── package.json
│
└── server/                # Express backend
    ├── src/
    │   ├── routes/        # API routes (courses, Zara AI)
    │   ├── controllers/   # Route handlers
    │   ├── services/      # Business logic
    │   ├── models/        # MongoDB schemas
    │   ├── middlewares/   # Express middleware
    │   ├── config/        # Database and config
    │   └── app.js         # Express app setup
    ├── server.js          # Server entry point
    └── package.json
🛠️ Tech Stack
Frontend
React 19 — UI library
Vite — Next-generation build tool
React Router v7 — Client-side routing
Tailwind CSS — Utility-first CSS framework
Framer Motion — Smooth animations
Zustand — Lightweight state management
Axios — HTTP client for API calls
React Syntax Highlighter — Code display
Recharts — Data visualization
Lucide React — Icon library
Backend
Express.js — Web framework
Node.js — Runtime environment
MongoDB — NoSQL database
Mongoose — ODM for MongoDB
Groq SDK — AI model integration
Multer — File upload handling
pdf-parse — PDF processing
CORS — Cross-origin resource sharing
Compression — Response compression
dotenv — Environment variable management
📚 API Endpoints
Courses
GET /api/courses — Get all courses
POST /api/courses — Create a new course
GET /api/courses/:id — Get course details
DELETE /api/courses/:id — Delete a course
Zara AI (Tutor)
POST /api/zara/ask — Ask Zara a question
POST /api/zara/chat — Chat with your AI tutor
🤝 Contributing
We welcome contributions! Here's how to get started:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Development Guidelines
Follow the existing code structure
Write meaningful commit messages
Ensure your code passes linting: npm run lint (client)
Test your changes before submitting a PR
For detailed contribution guidelines, see CONTRIBUTING.md

📖 Usage Example
Create a Course

Navigate to "Create Course" on the homepage
Upload a PDF document
Select a topic/category
Let AI generate your course structure
Browse Your Courses

Visit the "Courses" section
Click on any course to view modules and lessons
Take quizzes to test your knowledge
Get Help from Zara

Open the Zara AI chat in any course
Ask questions about the content
Get personalized explanations and guidance
🚢 Deployment
Both the client and server are configured for Vercel deployment:

Client: Uses vercel.json in /client with default build settings
Server: Uses vercel.json in /server with serverless function handler
See Vercel docs for deployment instructions.

📝 License
This project is licensed under the ISC License — see the LICENSE file for details.

🆘 Support & Documentation
Issues — Report bugs or request features
Discussions — Join community discussions
Documentation — Check the docs/ directory for detailed guides
👨‍💻 Author
Ajay — @Ajay-css

Built with ❤️ to make learning smarter and more accessible.

🛠️ Tech Stack
Frontend
React 19 — UI library
Vite — Next-generation build tool
React Router v7 — Client-side routing
Tailwind CSS — Utility-first CSS framework
Framer Motion — Smooth animations
Zustand — Lightweight state management
Axios — HTTP client for API calls
React Syntax Highlighter — Code display
Recharts — Data visualization
Lucide React — Icon library
Backend
Express.js — Web framework
Node.js — Runtime environment
MongoDB — NoSQL database
Mongoose — ODM for MongoDB
Groq SDK — AI model integration
Multer — File upload handling
pdf-parse — PDF processing
CORS — Cross-origin resource sharing
Compression — Response compression
dotenv — Environment variable management
📚 API Endpoints
Courses
GET /api/courses — Get all courses
POST /api/courses — Create a new course
GET /api/courses/:id — Get course details
DELETE /api/courses/:id — Delete a course
Zara AI (Tutor)
POST /api/zara/ask — Ask Zara a question
POST /api/zara/chat — Chat with your AI tutor
🤝 Contributing
We welcome contributions! Here's how to get started:

Fork the repository
Create a feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Development Guidelines
Follow the existing code structure
Write meaningful commit messages
Ensure your code passes linting: npm run lint (client)
Test your changes before submitting a PR
For detailed contribution guidelines, see CONTRIBUTING.md

📖 Usage Example
Create a Course

Navigate to "Create Course" on the homepage
Upload a PDF document
Select a topic/category
Let AI generate your course structure
Browse Your Courses

Visit the "Courses" section
Click on any course to view modules and lessons
Take quizzes to test your knowledge
Get Help from Zara

Open the Zara AI chat in any course
Ask questions about the content
Get personalized explanations and guidance
🚢 Deployment
Both the client and server are configured for Vercel deployment:

Client: Uses vercel.json in /client with default build settings
Server: Uses vercel.json in /server with serverless function handler
See Vercel docs for deployment instructions.

📝 License
This project is licensed under the ISC License — see the LICENSE file for details.

🆘 Support & Documentation
Issues — Report bugs or request features
Discussions — Join community discussions
Documentation — Check the docs/ directory for detailed guides
👨‍💻 Author
Ajay — @Ajay-css

Built with ❤️ to make learning smarter and more accessible.

