import express, { Router } from "express";
import login from "./routes/auth/Login";
import { forgetPassword, resetPassword } from "./routes/auth/PasswordReset";
import register from "./routes/auth/Register";
import { exitClub, joinClub } from "./routes/clubs/ClubInteraction";
import createClub from "./routes/clubs/CreateClub";
import getClubDetails from "./routes/clubs/GetClubDetails";
import updateClub from "./routes/clubs/UpdateClub";
import createPost from "./routes/posts/CreatePost";
import getAllPosts from "./routes/posts/GetAllPosts";
import getClubPosts from "./routes/posts/GetClubPosts";
import getPost from "./routes/posts/GetPost";
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

// clubs
routes.use("/create-club", createClub);
routes.use("/club-details", getClubDetails); // GET ?club_id=programming
routes.use("/join-club", joinClub);
routes.use("/exit-club", exitClub);
routes.use("/update-club", updateClub);

// users
routes.use("/user-details", getUserDetails); // GET ?username=louis
routes.use("/update-user", updateUser);

export default routes;
