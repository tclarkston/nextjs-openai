import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "./components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup(props) {
  const handleClick = async () => {
    const result = await fetch("/api/addTokens", {
      method: "POST",
    });
    const json = await result.json();
    console.log("RESULT: ", json);
    window.location.href = json.session.url;
  };

  return (
    <div className="h-full flex flex-col w-full m-auto">
      <div className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <h1>Token Topup Page</h1>
        <button className="btn" onClick={handleClick}>
          Topup
        </button>
      </div>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
