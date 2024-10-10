import { withPageAuthRequired } from "@auth0/nextjs-auth0";

export default function Post(props) {
  return (
    <div>
      <h1>Post ID page</h1>
    </div>
  );
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});
