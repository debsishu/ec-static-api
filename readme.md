## Installation and Usage

### Introduction

Ec-Static is a discussion forum. You can create clubs and create posts under those clubs and have real interaction with other people who have similar interests.

### Running Locally

- Clone the repository `git clone https://github.com/debsishu/ec-static-api.git`
- Install Dependencies `npm install`
- Install nodemon globally `npm install nodemon -g` in windows or `sudo install nodemon -g` in mac or linux
- Create a local .env file (example below)
- Create a JWT_SECRET `openssl rand -hex 32`
- Run local development server `npm run dev`

### Example .env file

| Name          | Explanation                                                                        |
| ------------- | ---------------------------------------------------------------------------------- |
| WHITELIST     | An array of string of domains which will be allows by CORS                         |
| JWTSECRET     | JsonWebToken secret key generated via `openssl rand -hex 32`                       |
| DBLINK        | MongoDB database connection link. Get from MongoDB Atlas                           |
| FRONTEND_HOST | Your frontend host                                                                 |
| MAILGUN_API   | Used for reset password mail. Get from [MailGun](https://www.mailgun.com/) website |

Example:

```plaintext
WHITELIST=["http://localhost:3000", "allowed-hosts..."]
JWTSECRET="474ae68490d3e1612043f0cf53aae4d60e44c77d883f42ba32c2836a95a73527"
DBLINK="<your-mongodb-connection-link>"
FRONTEND_HOST="http://localhost:3000"
MAILGUN_API="<your-mailgun-api-key>"
```

### Routes

- Run `npm run dev` to start the development server.
- The default port is 6969, the server will start at `http://localhost:6969/`
- Some of these routes need tokens to authorize, for those, add `x-auth-token` in the header of the request.
- To test these routes in postman add `Origin=http://localhost:3000` in header of the request

| HTTP Verbs | Endpoints                    | Action                                               | Url Parameters                                             | Request Body                                                 | Token Required |
| ---------- | ---------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ | -------------- |
| GET        | /api/users/:username         | Get details of a particular user                     | \-                                                         | \-                                                           | NO             |
| POST       | /api/users/update            | Update information of user                           | \-                                                         | name, profile_picture, cover_photo, bio                      | YES            |
| POST       | /api/clubs                   | To create a new club                                 | \-                                                         | name, club_id, description                                   | YES            |
| POST       | /api/clubs/:club_id/join     | To join a club                                       | \-                                                         | \-                                                           | YES            |
| POST       | /api/clubs/:club_id/update   | To update existing club info                         | \-                                                         | name, description, club_profile_picture, club_banner_picture | YES            |
| POST       | /api/clubs/:club_id/exit     | To exit a club                                       | \-                                                         | \-                                                           | YES            |
| GET        | /api/clubs/:club_id          | To get club details                                  | \-                                                         | \-                                                           | NO             |
| POST       | /api/posts                   | To create a new post                                 | \-                                                         | club_id, post_title, post_content, post_image                | YES            |
| POST       | /api/posts/:post_id/upvote   | To upvote a particular post                          | \-                                                         | \-                                                           | YES            |
| POST       | /api/posts/:post_id/downvote | To downvote a particular post                        | \-                                                         | \-                                                           | YES            |
| GET        | /api/posts/joined-clubs      | To get all the posts where user joined               | page, perPage, criteria=vote/time                          | \-                                                           | YES            |
| GET        | /api/posts                   | To get all the posts from all the clubs              | page, perPage, criteria=vote/time                          | \-                                                           | NO             |
| GET        | /api/posts/club/:club_id     | To get all the posts in a club                       | page, perPage, criteria=vote/time/trending, trendingDays=7 | \-                                                           | NO             |
| GET        | /api/posts/user/:user_id     | To get all the posts which a user posted             | page, perPage, criteria=vote/time                          | \-                                                           | NO             |
| GET        | /api/posts/:post_id          | To get a particular post                             | \-                                                         | \-                                                           | NO             |
| POST       | /api/login                   | To login a user                                      | \-                                                         | username, password                                           | NO             |
| POST       | /api/forgot-password         | To get a reset token in the mail                     | \-                                                         | email                                                        | NO             |
| POST       | /api/reset-password/:token   | To reset the password                                | :token                                                     | newPassword                                                  | NO             |
| POST       | /api/register                | To sign up a new user                                | \-                                                         | name, email, username, password                              | NO             |
| POST       | /api/comments/:post_id       | To post a comment under a post or another comment    | \-                                                         | comment_id?, content                                         | YES            |
| GET        | /api/comments/:post_id       | To get all the comments under a post                 | page, perPage                                              | \-                                                           | NO             |
| GET        | /api/clubs/popular           | To get the popular clubs with default count of 5     | count                                                      | \-                                                           | NO             |
| GET        | /api/users/joined-clubs      | To get all the clubs where user joined               | \-                                                         | \-                                                           | YES            |
| GET        | /api/search/posts            | To search from all the posts post title and content  | searchQuery, page, perPage                                 | \-                                                           | NO             |
| GET        | /api/search/clubs            | To search from all the clubs club_id and description | searchQuery, page, perPage                                 | \-                                                           | NO             |

### Contribution

- Feel free to contribute to this project.
- Fork the repository and make changes and open pull request.
