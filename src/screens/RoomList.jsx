import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  //const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  console.log("first")

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("second")

      try {
        const response = await axios.get('http://localhost:8080/api/conference-rooms');
        setRooms(response.data);
      } catch (error) {
        setError("Couldn't fetch rooms.");
      } 
    };

    fetchRooms();
  }, []);


  return (
    <>
      <Header />
      <div className="mt-10 max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-700">Conference Rooms   {console.log("third")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-10 bg-gray-100 rounded-lg shadow-md  transition-shadow duration-300 cursor-pointer"
              onClick={() => navigate(`/booking/${room.id}`)}  // Pass both room_id and user_id
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <p className="text-gray-500">Available: 9 AM to 9 PM</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
