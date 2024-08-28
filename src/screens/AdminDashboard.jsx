// src/screens/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const bookingResponse = await axios.get('http://localhost:8080/api/bookings');
        const companyResponse = await axios.get('http://localhost:8080/api/company-name');
  
        // Get the current time
        const currentTime = new Date();
  
        // Filter and sort the bookings
        const filteredAndSortedBookings = bookingResponse.data
          .filter((booking) => new Date(booking.startTime) > currentTime) // Filter bookings where startTime is greater than the current time
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort by startTime
  
        // Set the filtered and sorted bookings in the state
        setBookings(filteredAndSortedBookings);
        setCompanies(companyResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  
    fetchData();
  }, []);
  
  

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:8080/api/bookings/${bookingId}`);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleAddCompany = async () => {
    try {
      if (newCompany){
      await axios.post('http://localhost:8080/api/company-name', { name: newCompany });
      setCompanies([...companies, { name: newCompany }]);
      setNewCompany('');
      alert("Company added successfully!");
      }else{
        alert("Can't add empty company name")
      }
    } catch (error) {
      console.error('Error adding company:', error);
    }
  };

  return (
    <>
    <Header/>
    
    <div className="p-4 shadow-lg rounded-lg mt-10 max-w-5xl mx-auto" >
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Admin Dashboard</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Bookings</h3>
        <table className="w-full border-collapse bg-gray-100 rounded-lg overflow-hidden">
          <thead>
            <tr>
             
              <th className="border p-3 bg-gray-200">Booked By</th>
              <th className="border p-3 bg-gray-200">Company</th>
              <th className="border p-3 bg-gray-200">Conference Room Name</th>
              <th className="border p-3 bg-gray-200">Start Time</th>
              <th className="border p-3 bg-gray-200">End Time</th>
              <th className="border p-3 bg-gray-200">Date</th>
              <th className="border p-3 bg-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking.id}>
                <td className="border p-3"> {booking.user.username}</td>
                <td className="border p-3">{booking.user.company.name}</td>
                <td className="border p-3 text-center"> {booking.room.name}</td>
                <td className="border p-3">{new Date(booking.startTime).toLocaleTimeString()}</td>
                <td className="border p-3">{new Date(booking.endTime).toLocaleTimeString()}</td>
                <td className="border p-3">{new Date(booking.startTime).toLocaleDateString()}</td>
                <td className="border p-3">
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Company</h3>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={newCompany}
            onChange={(e) => setNewCompany(e.target.value)}
            placeholder="Company Name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
          />
          <button
            onClick={handleAddCompany}
            className=" p-3 bg-gray-600 text-white rounded-md  hover:shadow-lg focus:scale-105 focus:ring-1"
         >
            Add Company
          </button>
        </div>
      </div>
    </div>
   </>
  );
}
