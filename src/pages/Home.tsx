import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header, { type TypeOfButton } from "../components/Header";
import type { RootState } from "../reduxStore/store";
import { getBlogs } from "../services/blogServices";
import { setPages, setTotalPage } from "../reduxStore/blogSlice";
import { setNotification } from "../reduxStore/notificationSlice";
import Pagination from "../components/Pagination";
import { LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const blogsPerPage = 6;

  const { session } = useSelector((state: RootState) => state.auth);
  const { pages, totalPage } = useSelector((state: RootState) => state.blog);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const typeOfButton: TypeOfButton = session ? "dashboard" : "auth";

  const currentPageData = pages[currentPage - 1];
  const blogs = currentPageData?.blogs || [];

  useEffect(() => {
    if (currentPageData) return;

    const fetchBlogs = async () => {
      const from = (currentPage - 1) * blogsPerPage;
      const to = from + blogsPerPage;
      console.log("runn");

      setIsLoading(true);

      try {
        const { blogs, pageCount } = await getBlogs(from, to, blogsPerPage);

        dispatch(setTotalPage(pageCount));
        dispatch(setPages({ page: currentPage, blogs }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error";
        dispatch(setNotification({ status: "error", message }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage, currentPageData, dispatch]);

  return (
    <div className="mx-8 md:mx-20 xl:mx-32  md:mt-3 space-y-6">
      <Header typeOfButton={typeOfButton} />
      <div className="text-center my-10 pt-5 space-y-6">
        <h1 className="text-3xl sm:text-6xl font-semibold">
          Your own <span className="text-primary">blogging</span> platform.
        </h1>
        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-secondary-foreground">
          This is your space to think out loud, to share what matters, and to
          write without filters. Whether it's one word or a thousand, your story
          starts right here.
        </p>
      </div>

      <div className="-full">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col justify-center items-center h-60">
            <LoaderCircle className="text-primary animate-spin size-10" />
            <span className="text-secondary-foreground">loading...</span>
          </div>
        )}

        {/* blogs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {!isLoading &&
            blogs &&
            blogs.map(({ id, img_url, title, subTitle }) => (
              <Link key={id} to={`blog/${id}`}>
                <div className="size-full rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 cursor-pointer">
                  {img_url && (
                    <img src={img_url} alt={title} className="aspect-video" />
                  )}

                  <div className="pl-5">
                    <h5 className="mb-2 font-medium">{title}</h5>
                    <p className="mb-3 text-xs text-secondary-foreground">
                      {subTitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      <Pagination
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalPage={totalPage}
      />
    </div>
  );
};

export default Home;
