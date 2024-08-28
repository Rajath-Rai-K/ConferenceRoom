import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const MyBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();
  let userData = localStorage.getItem('userDetails')
  let user_id= JSON.parse(userData);
  useEffect(() => {
    const fetchBookings = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/bookings/user/' + user_id);
      
          // Get the current time
          const currentTime = new Date();
      
          // Separate upcoming and past bookings
          const upcomingBookings = response.data
            .filter((booking) => new Date(booking.startTime) > currentTime) // Filter upcoming bookings
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime)); // Sort upcoming bookings by startTime

            const ongoingBookings = response.data
            .filter(booking => new Date(booking.startTime) <= currentTime && new Date(booking.endTime) > currentTime)
            .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
            
          const pastBookings = response.data
            .filter((booking) => new Date(booking.endTime) <= currentTime) // Filter past bookings
            .sort((a, b) => new Date(b.startTime) - new Date(a.startTime)); // Sort past bookings by startTime (optional)
      
          // Combine upcoming and past bookings
          setBookings([...ongoingBookings,...upcomingBookings, ...pastBookings]);
        } catch (err) {
          setError('Failed to fetch bookings');
        } finally {
          setLoading(false);
        }
      };     
  
    fetchBookings();
  }, []);

  // Function to calculate duration in minutes between startTime and endTime
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / 60000; // convert milliseconds to minutes
    return duration;
  };

  // Function to format the date and time separately
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Extracts the date portion
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Extracts the time portion
  };

  const formatTime24Hour = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const filteredBookings = bookings.filter((booking) => {
    const currentTime = new Date();
    const isPastBooking = new Date(booking.endTime) <= currentTime;
    const isOngoingBooking = new Date(booking.startTime) <= currentTime && new Date(booking.endTime) > currentTime;

    if (filterType === 'upcoming') {
      return new Date(booking.startTime) > currentTime;
    } else if (filterType === 'ongoing') {
      return isOngoingBooking;
    } else if (filterType === 'past') {
      return isPastBooking;
    }
    return true; // for 'all' filterType
  });
  
  

  if (loading) {
    return <p className="text-gray-500 text-center mt-8">Loading bookings...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-8">{error}</p>;
  }

  return (
    <>
        <Header />
            <div className="container mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
            <div className="flex justify-between items-center mb-6">
  <h1 className="text-2xl font-semibold text-gray-800">My Bookings</h1>
  <div className="space-x-2">
    <button
      className={`px-4 py-2 rounded ${filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-white-200 text-blue-800'}`}
      onClick={() => setFilterType('all')}
    >
      All
    </button>
    <button
        className={`px-4 py-2 rounded ${filterType === 'ongoing' ? 'bg-green-600 text-white' : 'bg-white-200 text-green-800'}`}
        onClick={() => setFilterType('ongoing')}
    >
        Ongoing
    </button>
    <button
      className={`px-4 py-2 rounded ${filterType === 'upcoming' ? 'bg-yellow-600 text-white' : 'bg-white-200 text-yellow-800'}`}
      onClick={() => setFilterType('upcoming')}
    >
      Upcoming
    </button>
    <button
      className={`px-4 py-2 rounded ${filterType === 'past' ? 'bg-red-600 text-white' : 'bg-white-200 text-red-800'}`}
      onClick={() => setFilterType('past')}
    >
      Past
    </button>
  </div>
</div>

            <div className="overflow-x-auto">
                <div className="grid grid-cols-6 bg-gray-800 text-white p-2 rounded-t-lg">
                <span className="text-center">no.</span>
                <span className="text-center">Room Name</span>
                <span className="text-center">Date</span>
                <span className="text-center">Time</span>
                <span className="text-center">Duration</span>
                <span className="text-center">Action</span>
                </div>
                {filteredBookings.length > 0 ? (
  filteredBookings.map((booking, index) => {
    const isPastBooking = new Date(booking.endTime) <= new Date();
    const isOngoingBooking = new Date(booking.startTime) <= new Date() && new Date(booking.endTime) > new Date();


    return (
      <div
      key={booking.id}
      className={`grid grid-cols-6 items-center p-4 border-b border-gray-200 last:border-none ${
        isPastBooking ? 'bg-gray-300' : isOngoingBooking ? 'bg-green-400' : 'bg-gray-100'
      }`}
      >
        <span className="text-center text-gray-700">{index + 1}</span>
        <span className="text-center text-gray-700">{booking.room.name}</span>
        <span className="text-center text-gray-700">{formatDate(booking.startTime)}</span>
        <span className="text-center text-gray-700">{formatTime(booking.startTime)}</span>
        <span className="text-center text-gray-700">{calculateDuration(booking.startTime, booking.endTime)} minutes</span>
        <button
          className={`text-center px-4 py-2 rounded ${
            isPastBooking || isOngoingBooking
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-yellow-600 text-black hover:bg-orange-600 hover:text-white'
          }`}
          onClick={() => {
            if (!isPastBooking) {
              const queryParams = new URLSearchParams({
                date: formatDate(booking.startTime),
                startTime: formatTime24Hour(booking.startTime),
                endTime: formatTime24Hour(booking.endTime)
              }).toString();
              const userConfirmed = window.confirm("Are you sure you want to update the booking timings?");
              if (userConfirmed) {
                navigate(`/booking/${booking.room.id}?${queryParams}`);
              }
            }
          }}
          disabled={isPastBooking || isOngoingBooking}
        >
          Edit
        </button>
      </div>
    );
  })
) : (
  <p className="text-gray-500 text-center mt-8">No bookings found.</p>
)}
            </div>
            </div>
        </>
  );
};

export default MyBooking;
