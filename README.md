# nightzone

## Description

This is a website where the user can find parties to go, buy tickets, see which parties are rocking and who already is at the party. The user can also add parties and charge tickets.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault. In this page there are an animation from Lottie and a button to redirect to the home page.
- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault.
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup. In this page there are a video as a background and a navbar with a button to get started.
- **authentication** - As a user I want to sign up or sign in on the webpage so that I can see all the events that I could attend. The user can sign in and sign up in three ways: email, google authentication or facebook authentication. If the user decides to use their email, in the beginning there is no difference between sign in and sign up. The user types their email and the app checks if they are already registered or not. If yes, the user continues with log in (just email and password). If not, the user continues with sign up (first name, last name, email, checkbox for age, password and confirm password).
- **logout* - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account. The logout is in the dropdown navbar (when the user clicks on account).
- **userAccount** - As a user I want to access which events I added and which tickets I bought.
- **editAccount** - As a user I want to be able to edit or delete my account.
- **createEvent** - As a user I want to be able to create and event. The app is going to ask the user a few questions about the event: name (maximum of 30 characters), start date, start time, end date, end time, address, country, city , if is paid or not (if is paid, the user needs to fill in the price of the ticket), capacity of the party, description and add an image.
- **eventsList** - As a user I want to be able to see all the events and filter (by date, location, free or paid and categories) to find the event that I want to. As a user I also want to see all the events that are happening at the moment and see which ones are rocking. If users have checked in and up to 20% of party capacity has been reached, green bar appears. If between 20% and 50% of the party's capacity has already been reached, orange bar appears. If more than 50% of the party's capacity has already been reached, red bar appears, which means the party is rocking.
- **eventDetail** - As a user I want to be able to see all the event details (start date and time, end date and time, address, host, how many people already bought a ticket, how many tickets still available, the price, the description and the categories) and if its paid I want to buy the ticket (using stripe). I also want to know if the host is trustworthy. SO if the host already hosted 5 parties with more than 50 check in, he gets a super host seal and the icon before the host changes. The user can also add comments.
- **editEvent** - As a user I want to be able to edit or delete the event that I had created.

## Backlog

List of other features outside of the MVPs scope

Authentication:
- verify the email

Events:
- let the user chat with other users that already checked in the party.

## Components:
- Home
- Auth (5 states)
- Navbar
- Button
- EventsList (2 states: hot zone and next events)
- EventDetail
- CreateEvent(6 states)
- EditEvent
- Filters (only appear in the EventsList when the user clicks on a button)
- Account (2 states)
- EditAccount

## Paths:

- / (component: Home)
- /auth (component: Auth (initial state))
- /events (components: Navbar + EventsList + Filter (ternary operator))
- /create (components: Navbar + CreateEvent)
- /events/:eventId (components: Navbar + EventDetail)
- /events/:eventId/edit (components: Navbar + EditEvent)
- /account/:userId (components: Navbar + Account)
- /account/:userId/edit (components: Navbar + EditAccount)

## Routes:

- auth.routes.js:

  - GET /auth
    - check if the email typed already exist. If yes, continue with signin. If not, continue with signup

  - POST /signin
    - req.body = email, password

  - POST /signup
    - req.body = firstName, lastName, email, password, confirmPassword
    - if something goes wrong show an error message
    - if everything goes fine, redirects to /eventsList

  - POST /logout
    - redirects to /

  - GET /user


- file-upload.routes.js:
  - POST /upload
    - upload image with cloudinary

- events.routes.js:

  - GET /events
    - show the list with events

  - POST /create
    - req.body = name, startDate, startTime, endDate, endTime, address, country, city, isPaid, price, capacity, description, image

  - GET /event/:eventId

  - PATCH /events/:eventId

  - DELETE /events/:eventId

  - POST /events/:eventId/comment
    - req.body = comment


- user.routes.js
  - GET /account/:userId
  - POST /account/:userId
  - PATCH /account/:userId
  - DELETE /account/:userId

## Models

User model

```
firstName: String,
lastName: String,
email: {
  type: String,
  unique: true
},
password: String,
googleID: String,
facebookId: String,
imageAccount: {
  type: String,
  default: 'images/default-avatar.png
},
eventsCreated:[{
  type: Schema.Types.ObjectId,
  ef: 'event'
}],
ticketsBought: [{
  type: Schema.Types.ObjectId,
  ref: 'event'
}],
superHost: {
  type: Boolean,
  default: false
}
```

Event model

 ```
 name: {
   type: String,
   required: true
 },
 startDate: {
   type: String,
   required: true
 },
 startTime: {
   type: String,
   required: true
 },
 endDate: {
   type: String,
   required: true
 },
 startTime: {
   type: String,
   required: true
 },
 address: {
   type: String,
   required: true
 },
 country: {
   type: String,
   required: true
 },
 city: {
   type: String,
   required: true
 },
 isPaid: {
   type: Boolean,
   required: true
 },
 ticketsPrice: Number,
 capacity: {
   type: Number,
   required: true
 },
 categories: [String],
 description: {
   type: String,
   required: true
 }
 imageAccount: {
    type: String,
    default: '/images/default-image.jpeg'
 },
ticketsSold:[{
  type: Schema.Types.ObjectId,
  ref: 'user'
}],
host : {
  type: Schema.Types.ObjectId,
    ref: "user",
}
```

Comments model

```
comment: {
  type: String,
  required: true
},
authorId : {
  type: Schema.Types.ObjectId,
  ref: "user",
},
eventId : {
  type: Schema.Types.ObjectId,
  ref: "event",
}
```


## Links

### APIS
https://countriesnow.space/api/v0.1/countries

### Dependencies
https://www.npmjs.com/package/stripe

https://www.npmjs.com/package/cloudinary

https://react-bootstrap.github.io/

https://lottiefiles.com/

https://www.npmjs.com/package/serve-favicon

https://www.npmjs.com/package/react-google-login

https://www.npmjs.com/package/react-facebook-login

https://www.npmjs.com/package/axios

https://www.npmjs.com/package/bcryptjs

https://www.npmjs.com/package/react-router-dom

https://www.npmjs.com/package/react-lottie

https://www.npmjs.com/package/react

https://www.npmjs.com/package/react-dom

### Wireframe

https://www.figma.com/file/I8GbTurEQ8wQ6cdVHz4EU7/nigthzone?node-id=0%3A1

### Trello

https://trello.com/b/RQA4nfqp/nightzone

### Git

[Repository Link](https://github.com/marileitune/nightzone-server)
[Repository Link](https://github.com/marileitune/nightzone-client)

### Slides

[Slides Link]
