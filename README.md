# Oriserve-Frontend-Assignment

# Project Overview

Bug Tracker is a web application that allows users to report, track, and manage bugs within their projects. Built with Next.js, it leverages a user-friendly interface, making issue tracking and team collaboration efficient and organized. The project is built with TypeScript, styled with Tailwind CSS, and uses Prisma ORM and PostgreSQL (via Supabase) for data management and storage.

# Getting Started
Before running the project, make sure you have **Node.js** and **npm** installed on your machine.

# Installation

use this .env file because i was getting some issues while deploying the project. Usually i solves the issue but this issue i have never across yet i will try to fix it.

DATABASE_URL="postgresql://postgres.maefugghbvrfhndlfbdk:M8i1Th3PnXzn08R6@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1" # Set this to the Transaction connection pooler string you copied in Step 1
DIRECT_URL="postgresql://postgres.maefugghbvrfhndlfbdk:M8i1Th3PnXzn08R6@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"  # Set this to the Session connection pooler string you copied in Step 1

KINDE_CLIENT_ID=61ad6319e63140f5b47575b1d51dfd93
KINDE_CLIENT_SECRET=I7uFXvsv5SfxKkxTTwudczNJF5OiyhRdzUcGsylZUGk5E2PLLa
KINDE_ISSUER_URL=https://fealtyxfrontendassignment.kinde.com
KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/api/auth/creation


1.Clone the repository:

Clone: Open your terminal or command prompt and run

  ```bash
   git clone https://github.com/anasnadkar45/oriserve-frontend-assignment.git
   cd oriserve-frontend-assignment
```

Download: Alternatively, you can download the repository as a ZIP file from GitHub and extract it to your local machine.

2.Open the Project in a Code Editor:

 Navigate to the directory where you extracted or cloned the repository.
 Open the project folder in your preferred code editor .

3.Install Dependencies

 Open a terminal or command prompt within your project directory.

 Run the following command to install the required dependencies

 ```bash
  npm install
```

4.Run the Project

 After the dependencies are installed, start the project by running

 ```bash
npm run dev
```
This will usually start the development server and open the application in your default web browser.

# Features
- User Authentication: Secure login and registration for users.
- Bug Reporting: Create, update, assign, and track bugs.
- Category-based Filter: View bugs by category, priority, and status.
- Responsive Design: Works across devices with various screen sizes.


# Technologies Used
- Next.js
- React.js
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Zod
- React Icons

