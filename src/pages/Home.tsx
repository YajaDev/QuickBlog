import { useSelector } from "react-redux";
import Header, { type TypeOfButton } from "../components/Header";
import type { RootState } from "../reduxStore/store";

const Home = () => {
  const { session } = useSelector((state: RootState) => state.auth);

  const typeOfButton: TypeOfButton = session
    ? "dashboard" // props if user is authenticated
    : "auth"; // if not

  return (
    <div className="min-h-screen mx-8 md:mx-20 xl:mx-32">
      <Header typeOfButton={typeOfButton} />
      <div>Home</div>
    </div>
  );
};

export default Home;
