README: 
This application was developed as a project HR administration system that captures the personal information of employees and their departments, in order for management to have an easy way of keeping track of the employees within the organisation.


How to Run the T3 Stack Application Locally
Prerequisites
Before you begin, ensure you have met the following requirements:

T3 Stack: Make sure you have the T3 stack installed. You can follow the installation guide on the T3 documentation.
Node.js: Ensure you have Node.js installed. You can download it from the Node.js official website.
npm: npm comes bundled with Node.js. You can verify the installation by running:
bash
Copy code
npm -v
SQLite: Ensure SQLite is installed on your system. You can download it from the SQLite official website.
Prisma CLI: Make sure Prisma CLI is installed. You can install it globally with the following command:
bash
Copy code
npm install -g prisma

Steps to Run the App Locally

1) Download repository project file from GitHub
2) Unzip the project folder found in "downloads"
3) Extract the project folder and move it to a directory of your choice
4) Open the project folder in the VS code or any text editor of your choice
5) Create a ".env" file in the root folder.
6) Ensure that you put the following information into your ".env" file
  DATABASE_URL=file:./db.sqlite
  NEXTAUTH_URL=http://localhost:3000
  DISCORD_CLIENT_ID=your_discord_client_id
  DISCORD_CLIENT_SECRET=your_discord_client_secret
  NEXTAUTH_SECRET=your_nextauth_secret_here
7) install dependencies by opening your command propmpt, "cd" into you project folder directory and run "npm install"
8) In the same command prompt terminal run "npx prisma migrate dev" (***Very important, nothing will populate on the homepage if you do not do this***)
9) In the same command prompt terminal run "npm run dev" This command will start the application, and you should see output indicating the server is running.
10) To access the application open your web browser and go to "http://localhost:3000". You should see your application running.

11) Optional: Run Prisma Studio to manage your database visually, you can run Prisma Studio by running "npx prisma studio" in the command promt.

Troubleshooting
If you encounter issues, ensure that you have followed all the steps correctly, especially setting up the .env file and installing dependencies.
Make sure that all the required packages are installed, and your Node.js version is compatible with the project.
Conclusion
Congratulations! You have successfully set up and run your T3 stack application locally. 

