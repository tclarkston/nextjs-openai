import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import Markdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { getAppProps } from "../../utils/getAppProps";

export default function Post(props) {

  return (
    <div className="overflow-auto h-full">
      <div className="max-w-screen-sm mx-auto">
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 bg-stone-200 border rounded-md">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          keywords
        </div>
        <div className="flex flex-wrap pt-2 gap-1">
          {props.keywords.split(",").map((keyword, i) => (
            <div className="p-2 rounded-full bg-slate-800 text-white" key={i}>
              <FontAwesomeIcon icon={faHashtag} />
              {keyword}
            </div>
          ))}
        </div>
        <div className="text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Blog Post
        </div>
        <Markdown>{props.postContent || ""}</Markdown>
      </div>
    </div>
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res);
    const client = await clientPromise;
    const db = client.db("BlogStandard");
    const user = await db
      .collection("users")
      .findOne({ auth0Id: userSession.user.sub });

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.id),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          postContent: post.postContent,
          title: post.title,
          metaDescription: post.metaDescription,
          keywords: post.keywords,
          topic: post.topic,
          ...props,
        },
      };
    }
  },
});
