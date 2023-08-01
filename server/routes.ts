import express, { Router } from "express";
import login from "./routes/auth/Login";
import { forgetPassword, resetPassword } from "./routes/auth/PasswordReset";
import register from "./routes/auth/Register";
import { exitClub, joinClub } from "./routes/clubs/ClubInteraction";
import createClub from "./routes/clubs/CreateClub";
import getClubDetails from "./routes/clubs/GetClubDetails";
import updateClub from "./routes/clubs/UpdateClub";
import getComments from "./routes/comments/GetComments";
import postComment from "./routes/comments/PostComment";
import createPost from "./routes/posts/CreatePost";
import getAllPosts from "./routes/posts/GetAllPosts";
import getClubPosts from "./routes/posts/GetClubPosts";
import getJoinedClubPosts from "./routes/posts/GetJoinedClubPosts";
import getPopularClubs from "./routes/posts/GetPopularClubs";
import getPost from "./routes/posts/GetPost";
import getUserPosts from "./routes/posts/GetUserPosts";
import { downvotePost, upvotePost } from "./routes/posts/VotePosts";
import searchClubs from "./routes/search/SearchClubs";
import searchPost from "./routes/search/SearchPost";
import getJoinedClubs from "./routes/user/GetJoinedClubs";
import getUserDetails from "./routes/user/GetUserDetails";
import updateUser from "./routes/user/UpdateUser";

const routes: Router = express.Router();

// auth
routes.use("/", register); // POST api/register
routes.use("/", login); // POST api/login
routes.use("/", forgetPassword); // POST api/forgot-password
routes.use("/", resetPassword); // POST api/reset-password/:token

// posts
routes.use("/", createPost); // POST api/posts (token-required)
routes.use("/", getJoinedClubPosts); // GET api/posts/joined-clubs?page=1&perPage=10 (token-required)
routes.use("/", getClubPosts); // GET api/posts/club/:club_id?page=1&perPage=10
routes.use("/", getUserPosts); // GET api/posts/user/:user_id
routes.use("/", upvotePost); // POST api/posts/:post_id/upvote (token-required)
routes.use("/", downvotePost); // POST api/posts/:post_id/downvote (token-required)
routes.use("/", getAllPosts); // GET api/posts?page=1&perPage=10
routes.use("/", getPost); // GET api/posts/:post_id

// clubs
routes.use("/", joinClub); // POST api/clubs/:club_id/join (token-required)
routes.use("/", exitClub); // POST api/clubs/:club_id/exit (token-required)
routes.use("/", updateClub); // POST api/clubs/:club_id/update (token-required)
routes.use("/", getPopularClubs); // GET api/clubs/popular?count=5
routes.use("/", getClubDetails); // GET api/clubs/:club_id
routes.use("/", createClub); // POST api/clubs (token-required)

// users
routes.use("/", updateUser); // POST api/users/update (token-required)
routes.use("/", getJoinedClubs); // GET api/users/joined-clubs (token-required)
routes.use("/", getUserDetails); // GET api/users/:username

// comments
routes.use("/", postComment); // POST api/comments/:post_id (token-required)
routes.use("/", getComments); // GET api/comments/:post_id?page=1&perPage=10

// search
routes.use("/", searchPost); // GET api/search/posts?searchQuery=hi there
routes.use("/", searchClubs); // GET api/search/clubs?searchQuery=hi there

export default routes;
