import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function TokenTopup(props) {
  return (
    <div>
      <h1>Token Topup Page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
