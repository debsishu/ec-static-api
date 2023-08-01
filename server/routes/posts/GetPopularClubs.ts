import express, { Request, Response, Router } from "express";
import { ResponseError } from "../../types/Error";
import Club from "../../models/Club";

const getPopularClubs: Router = express.Router();

getPopularClubs.get("/clubs/popular", async (req: Request, res: Response) => {
  const count: number = parseInt(req.query.count as string) || 5;

  try {
    const clubs = await Club.find()
      .sort({ member_count: -1 })
      .limit(count)
      .select("name club_id member_count");

    if (!clubs || clubs.length === 0) {
      throw new ResponseError("no-club-found", "No popular clubs found", 400);
    }

    res.status(200).json(clubs);
  } catch (err) {
    if (err instanceof ResponseError) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      return res.status(404).json({ message: "Something went wrong" });
    }
  }
});

export default getPopularClubs;
