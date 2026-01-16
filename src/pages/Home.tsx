import Header, { type RedirectBtn } from "../components/Header";

const Home = () => {
  const redirectBtn: RedirectBtn = { name: "Dashboard", to: "dashboard" };

  return (
    <div className="min-h-screen mx-8 md:mx-20 xl:mx-32">
      <Header redirectBtn={redirectBtn} />
      <div>Home</div>
    </div>
  );
};

export default Home;
