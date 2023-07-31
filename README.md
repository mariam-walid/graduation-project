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

4. Assignments App: Resembling Google Classroom, this app enables educators to create and manage assignments, while students can submit their completed tasks.
    - Navigate list of assignments
    ![assignments home](/public/screens/assignments%20home.PNG)
    - Add Assignment
    ![add assignment](/public/screens/new%20assignment.PNG)
    - Attach new files, edit, and delete my own assignment
    ![my assignment](/public/screens/my%20assignment.PNG)
    ![attach](/public/screens/attach.PNG)
    ![edit](/public/screens/edit%20assignment.PNG)
    - Upload and submit my work to an assignment
    ![add work](/public/screens/add%20work.PNG)
    ![submit](/public/screens/submit%20work.PNG)
    - View users work for my assignment to give them grade
    ![users work](/public/screens/users%20work.PNG)
    - The ability to download attachments

5. Time Tracking App: A time management tool that helps users track their study hours and optimize their learning schedules.
- Display list of added work
![timer home](/public/screens/timer%20home.PNG)
- Choose project from list or it can be without project also you can delete projects from the list
![choose project](/public/screens/choose%20project.PNG)
- Add new project
![new project](/public/screens/new%20project.PNG)
