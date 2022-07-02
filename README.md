# URL Shortener 🔗
A simple web application built with Node.js, Express, and MongoDB for you to readily get a shortened URL to use


### Trial in this project 🤠
**To increase user experience**
+ [Animate.css](https://daneden.github.io/animate.css/) is used to show animation for certain actions

___

## Project First Look
![Application Screen Shot in GIF](url-shortener.gif)


## User Stories
1. User can input a set of URL aiming to be shortened
2. User can get a warning message for invalid URL format input
3. User can get a set of shortened URL from the original URL provided
4. User can copy the shortened URL to clipboard by clicking the copy button
5. User can reset the input columns for next URL generation 
6. User can be redirected to the original URL by visiting the shortened URL

## Admin Stories
1. Admin can configure validation of URLS to restrict urls redirections. Eg:
```
    export URLSHORTENER_URL_REGEXP="^https?://[^/]*.mydomain.com(/.*|)$"
    export URLSHORTENER_URL_ERROR_MESSAGE="url must refer to mydomain.com"
```
___

## Installation
The following instructions will get you a copy of the project and all the setting needed to run it on your local machine.


### Prerequisites

- [npm](https://www.npmjs.com/get-npm)
- [Node.js v10.16.0](https://nodejs.org/en/download/)
- [MongoDB v4.0.10](https://www.mongodb.com/download-center/community)


### Clone

Clone this repository to your local machine

```
$ git clone https://github.com/smallpaes/url-shortener.git
```

### Setup

** Install npm packages**

```
$ npm install
```

** Start a database server**

```
$ docker-compose up -d
```

** Activate the web server**

```
$ npm run dev
```

** Wait the message for successful activation**

```
> App is running
> mongodb connected!
```
Now you may visit the application on browser at URL: http://localhost:3000

___


## FAQ
- **Can I try this app online?**
    - Yes, kindly visit [https://ancient-cove-62781.herokuapp.com/](https://ancient-cove-62781.herokuapp.com/)


___

## Authors
[Mike Huang](https://github.com/smallpaes)
