import express, { Request, Response, Router } from "express";
import Club from "../../models/Club";
import { MissingInformationError, ResponseError } from "../../types/Error";

const searchClubs: Router = express.Router();

searchClubs.get("/", async (req: Request, res: Response) => {
  const { searchQuery } = req.query;
  const perPage: number = parseInt(req.query.perPage as string) || 10;
  const page: number = parseInt(req.query.page as string) || 1;
  const skipAmount = (page - 1) * perPage;

  try {
    if (!searchQuery)
      throw new MissingInformationError("No search query provided");

    const searchCriteria = {
      $or: [
        { club_id: { $regex: searchQuery, $options: "i" } },
        { name: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ],
    };

    const clubs = await Club.find(searchCriteria)
      .select("-members")
      .skip(skipAmount)
      .limit(perPage);

    if (!clubs || clubs.length === 0) {
      throw new ResponseError(
        "no-post-found",
        "No post found with the search query",
        400
      );
    }

    const paginationInfo = {
      page,
      perPage,
      hasNextPage: clubs.length === perPage,
    };

    return res.status(200).json({ clubs, paginationInfo });
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

export default searchClubs;
