# Installation and Usage

### Introduction

Ec-Static is a discussion forum. You can create clubs and create posts under those clubs and have real interaction with other people who have similar interset.

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

```
WHITELIST=["http://localhost:3000", "allowed-hosts..."]
JWTSECRET="474ae68490d3e1612043f0cf53aae4d60e44c77d883f42ba32c2836a95a73527"
DBLINK="<your-mongodb-connection-link>"
FRONTEND_HOST="http://localhost:3000"
MAILGUN_API="<your-mailgun-api-key>"

```

### Routes

- Run `npm run dev` to start the development server.
- The default port is 6969, the server will start at `http://localhost:6969/`
- Some of this routes needs token to authorize, for those add `x-auth-token` in header of the request
- To test these routes in postman add `Origin=http://localhost:3000` in header of the request

| HTTP Verbs | Endpoints                  | Action                                   | Url Parameters         | Request Body                                                          | Token Required |
| ---------- | -------------------------- | ---------------------------------------- | ---------------------- | --------------------------------------------------------------------- | -------------- |
| GET        | /api/user-details          | Get details of a particular user         | username               | -                                                                     | NO             |
| POST       | /api/update-user           | Update information of user               | -                      | name, profile_picture, cover_photo, bio                               | YES            |
| POST       | /api/create-club           | To create a new club                     | -                      | name, club_id, description                                            | YES            |
| POST       | /api/join-club             | To join a club                           | -                      | club_id                                                               | YES            |
| POST       | /api/update-club           | To update existing club info             | -                      | name, description, club_id, club_profile_picture, club_banner_picture | YES            |
| POST       | /api/exit-club             | To exit a club                           | -                      | club_id                                                               | YES            |
| GET        | /api/club-details          | To get club details                      | -                      | club_id                                                               | NO             |
| POST       | /api/create-post           | To create a new post                     | -                      | club_id, post_title, post_content, post_image                         | YES            |
| POST       | /api/upvote                | To upvote a particular post              | -                      | post_id                                                               | YES            |
| POST       | /api/downvote              | To downvote a particular post            | -                      | post_id                                                               | YES            |
| GET        | /api/get-joined-club-posts | To get all the posts where user joined   | page, perPage          | -                                                                     | YES            |
| GET        | /api/get-all-posts         | To get all the posts from all the clubs  | page, perPage          | -                                                                     | NO             |
| GET        | /api/get-club-posts        | To get all the posts under a club        | club_id, page, perPage | -                                                                     | NO             |
| GET        | /api/get-user-posts        | To get all the posts which a user posted | user_id, page, perPage | -                                                                     | NO             |
| GET        | /api/get-post              | To get a particular post                 | post_id                | -                                                                     | NO             |
| POST       | /api/login                 | To login a user                          | -                      | username, password                                                    | NO             |
| POST       | /api/forgot-password       | To get a reset token in the mail         | -                      | email                                                                 | NO             |
| POST       | /api/reset-password/:token | To reset the password                    | :token                 | newPassword                                                           | NO             |
| POST       | /api/register              | To sign up a new user                    | -                      | name, email, username, password                                       | NO             |

### Contribution

- Fell free to contribute to this project.
- Fork the repository and make changes and open pull request.
