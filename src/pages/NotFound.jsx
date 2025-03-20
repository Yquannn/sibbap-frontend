import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1 className="text-center text-9xl font-bold text-gray-600">Opps! 404</h1>
        <p className="text-center text-xl font-bold mt-7 text-gray-600">Page not found</p>
      </div>
      <div className="text-center m-4 text-xl">
        <Link to="/dashboard">
          Go back <span className="text-blue-600 underline">Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
