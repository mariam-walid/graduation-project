# Enabled-U: Learning Management System
![Enabled-u logo](/public/enabled-logo.svg)

### Table of contents
- [Introduction](#introduction)
- [Features](#features)


## Introduction 
Enabled -U is a modern and user-friendly Learning Management System (LMS) developed in Next.js. The platform aims to facilitate an enhanced educational experience by providing various features for both educators and students. The system offers a Q&A app, an assignments app, and a time tracking app to ensure a seamless learning journey.

This project serves as a graduation project, demonstrating the capabilities of a front-end developer in collaboration with a backend team. The app uses real endpoints from the backend to create a realistic and functional learning environment.


## Features
The Enabled-U LMS comes with the following features:

1. Landing Page: A well-designed landing page with information about the platform's purpose, features, and benefits.
![landing page](/public/screens/landingPage.PNG)

2. User Authentication: Users can register and log in through the links provided in the navigation bar to access the LMS features.
    - User registration
    ![register](/public/screens/register.PNG)
    - Registration error if the user already exists in the database
    ![register error](/public/screens/registerError.PNG)
    - Log in if the user already registered
    ![login](/public/screens/login.PNG)
    - Login error if the user entered wrong credentials
    ![login error](/public/screens/loginError.PNG)

3. Features access

   If the user successfully loged in the system, the features will be available in the navbar so the user can use them
![available features](/public/screens/availableFeatures.PNG)

3. Q&A App: Similar to Stack Overflow, the Q&A app allows users to:
    - Navigate list of posted questions
    ![qna home](/public/screens/qnaHome.PNG)
    - Ask question
    ![ask question](/public/screens/askQuestion.PNG)
    - Edit or delete your own question
    ![my question](/public/screens/myQuestion.PNG)
    ![edt question](/public/screens/editQuestion.PNG)
    - View single question details
    ![question details](/public/screens/questionDetails.PNG) 
    - Show or hide comments on answer
    ![show comments](/public/screens/showComments.PNG)
    - Accept answers on my question
    ![accept answer](/public/screens/acceptAnswer.PNG)
    - Upvote and downvote questions, answers,and comments

Assignments App: Resembling Google Classroom, this app enables educators to create and manage assignments, while students can submit their completed tasks.

Time Tracking App: A time management tool that helps users track their study hours and optimize their learning schedules.
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
