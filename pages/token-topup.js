import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "./components";

export default function TokenTopup(props) {
  return (
    <div>
      <h1>Token Topup Page</h1>
    </div>
  );
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
