import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const {
      user: { sub },
    } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db.collection("users").findOne({
      auth0Id: sub,
    });

    const { lastPostDate } = req.body;
    const posts = await db
      .collection("posts")
      .find({
        userId: user._id,
        created: {
          $lt: new Date(lastPostDate),
        },
      })
      .limit(5)
      .sort({
        created: -1,
      })
      .toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).end(error.message);
  }
});
