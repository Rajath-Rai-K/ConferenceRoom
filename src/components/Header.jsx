import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userDetails");
    navigate("/login");
  };

  const openMyBookings = () => {
    navigate("/myBookings");
  }

  const openMyCompBookings = () => {
    navigate("/companyBookings");
  }

  return (
    <header className="bg-gray-800 text-white py-4 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Conference Room Management System
        </h1>
        <nav>
          {!localStorage.getItem("userDetails") ? (
            <div></div>
          ) : (
            <div className="flex items-center  space-x-4">
              <button
          className="w-100 p-3 bg-gray-600 text-white rounded-md transform transition-transform duration-200 ease-in-out  hover:shadow-lg focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={openMyBookings}
              >
                My Bookings
              </button>
              {/* <button
          className="w-100 p-3 bg-gray-600 text-white rounded-md transform transition-transform duration-200 ease-in-out  hover:shadow-lg focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={openMyCompBookings}
              >
                Company Bookings
              </button> */}
              <button
          className=" p-3 bg-gray-600 text-white rounded-md transform transition-transform duration-200 ease-in-out  hover:shadow-lg focus:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
