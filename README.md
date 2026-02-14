Overview

CareerConnect is a specialized job portal for BRAC University students and alumni, connecting them with global job opportunities, career events, and renowned companies. It offers profile management, advanced job filtering (department-wise, time-based), application tracking, real-time notifications via Google Calendar, query forums, and company tools for candidate sourcing and event creation. Designed exclusively for BRACU's ecosystem with Cloudinary storage and Google authentication, it bridges students and employers while improving recruitment efficiency and institutional reputation.
b
Features

User Registration and Login: Secure account creation with email verification

User Profile Management: Build detailed profiles with skills, experience, education, and resume uploads

Job Search and Filter: Advanced search by location, title, salary, experience, and remote options

Job Applications: One-click apply with application tracking and status updates

Networking: Connect with recruiters, mentors, and peers via professional dashboard

Job Recommendations: AI-powered matching based on user profiles and preferences

Application Tracker: Monitor application statuses, interviews, and follow-ups

Notifications: Real-time alerts for jobs, messages, and deadlines

Technologies Used

Frontend:

React.js

Tailwind CSS

JavaScript (ES6+)

Backend:

Node.js

Express.js

Database:

MongoDB (or PostgreSQL)

Other:

JWT Authentication

Socket.io (real-time notifications)

Cloudinary (resume/image storage)

Getting Started

Clone the Repository:

text
git clone https://github.com/yourusername/CareerConnect.git
Install Dependencies:

text
npm install
# Backend: cd backend && npm install
Database Setup:

Set up MongoDB locally or MongoDB Atlas

Create .env file: MONGODB_URI, JWT_SECRET, PORT

Run Development Server:

text
npm run dev
# Or: npm run server & npm run client
Access Platform: Open browser to http://localhost:3000/
