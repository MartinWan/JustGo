# JustGo

This application is meant to allow users to play the Go board game
with friends through networked-play or in hotseat mode 
(... or with an AI if the user has no friends.)
Implemented using NodeJS, ExpressJS, and MongoDB.

This project was for UVic's SENG 299 Software Architecture course.
Use of front-end frameworks were restricted in order to understand the motivations 
behind frameworks like AngularJS and ReactJS.

App can be accessed here: http://justgoproject.herokuapp.com/

## Screenshots

![Screenshot](/doc/screenshot.png) 



### Installation

1. Install dependencies

    In the root directory of the project type into command line: npm install 

2. Install mongodb: https://www.mongodb.com/

3. Create environment configuration for mongo, google-login, and session secret

    Set the variables in a new .env file in the project root with the format
    
    GOOGLE_ID=Value
    GOOGLE_SECRET=Value
    
    MONGODB_URI=Value
    MONGOLAB_URI=Value
    
    SESSION_SECRET=Value
    
3. Type npm run dev
