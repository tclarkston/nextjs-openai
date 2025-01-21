import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("BlogStandard");

  const userProfile = await db
    .collection("users")
    .findOne({ auth0Id: user.sub });

  if (userProfile?.availableTokens <= 0) {
    res.status(403).json({ error: "Insufficient tokens" });
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);
  const { topic, keywords } = req.body;

  if (!topic || !keywords || topic.length > 80 || keywords.length > 80) {
    res.status(422);
    return;
  }

  const response = await openai.createChatCompletion({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog generator called BlogStandard. You are designed to output markdown without frontmatter.",
      },
      {
        role: "user",
        content: `
        Generate a blog post on the following topic delimited by triple hyphens:
        ---
        ${topic}
        ---
        Targeting the following comma separated keywords delimited by triple hyphens:
        ---
        ${keywords}
        ---
        `,
      },
    ],
  });

  const postContent = response.data.choices[0]?.message?.content;

  const seoResponse = await openai.createChatCompletion({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an SEO friendly blog generator called BlogStandard. You are designed to output JSON. Do not include HTML tags in your output",
      },
      {
        role: "user",
        content: `
        Generate an SEO friendly title and SEO friendly meta description for the following blog post:
        ${postContent}
        ---
        The output json must be in the following format:
        {
          "title": "SEO friendly title",
          "metaDescription": "SEO friendly meta description"
        }
        ---
        `,
      },
    ],
    response_format: { type: "json_object" },
  });

  const seo = seoResponse.data.choices[0]?.message?.content ?? {};
  const json = JSON.parse(seo);
  const { title, metaDescription } = json ?? {};

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const post = await db.collection("posts").insertOne({
    postContent,
    title,
    metaDescription,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
    updated: new Date(),
    published: false,
    publishedAt: null,
    views: 0,
    likes: 0,
    dislikes: 0,
    comments: 0,
  });

  res.status(200).json({
    postId: post.insertedId,
  });
});
