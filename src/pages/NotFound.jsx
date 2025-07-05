import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">
        <div className="text-primary-600 font-bold text-9xl">404</div>
        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="btn btn-primary px-8"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
