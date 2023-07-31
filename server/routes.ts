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
routes.use("/register", register);
routes.use("/login", login);
routes.use("/forgot-password", forgetPassword);
routes.use("/reset-password", resetPassword); // reset-password/:token

// posts
routes.use("/create-post", createPost);
routes.use("/get-all-posts", getAllPosts); // GET ?page=1&perPage=10
routes.use("/get-post", getPost); // GET ?post_id=1231242342
routes.use("/get-club-posts", getClubPosts); // GET ?page=1&perPage=10&club_id=1234839392829
routes.use("/get-user-posts", getUserPosts); // GET ?user_id=12341234234
routes.use("/get-joined-club-posts", getJoinedClubPosts); // GET ?page=1&perPage=10 (token-required)
routes.use("/upvote", upvotePost);
routes.use("/downvote", downvotePost);

// clubs
routes.use("/create-club", createClub);
routes.use("/club-details", getClubDetails); // GET ?club_id=programming
routes.use("/join-club", joinClub);
routes.use("/exit-club", exitClub);
routes.use("/update-club", updateClub);
routes.use("/get-popular-clubs", getPopularClubs); // GET ?count=5

// users
routes.use("/user-details", getUserDetails); // GET ?username=louis
routes.use("/update-user", updateUser);
routes.use("/get-joined-clubs", getJoinedClubs); // GET

// comments
routes.use("/post-comment", postComment);
routes.use("/get-comments", getComments);

// search
routes.use("/search-posts", searchPost);
routes.use("/search-clubs", searchClubs);

export default routes;
