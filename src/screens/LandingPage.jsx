import { Link } from 'react-router-dom';
import Header from '../components/Header';

export default function LandingPage() {
  return (
    <>
      <Header />
      <div className="mt-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-6 text-gray-700">Welcome User!</h1>
        <div className="space-y-4">
          <Link
            to="/login"
            className="block w-full p-3 bg-gray-600 text-white rounded-md transform transition-transform duration-200 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block w-full p-3 bg-gray-600 text-white rounded-md transform transition-transform duration-200 ease-in-out hover:bg-gray-700 hover:shadow-lg focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Signup
          </Link>
        </div>
      </div>
    </>
  );
}
