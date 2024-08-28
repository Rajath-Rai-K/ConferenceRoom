import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import Header from '../components/Header';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: users } = await axios.get('http://localhost:8080/api/users');
      const user = users.find(user => user.email === email);
      const user_id = user.id;
     
      
  
      if (user) {
        const pwdCompare = await bcrypt.compare(password, user.password)
        if (pwdCompare){
          if (user.role.id === 2){
            navigate('/admin-dashboard');
          } else {
            localStorage.setItem('userDetails',JSON.stringify(user_id))
            navigate(`/RoomList`);
          }

        } else {
          setError('Invalid email or password.');
        }
      } else {
        setError("This email doesn't exist");
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <>
    <Header/>
    <div className="mt-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">Login</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-lg font-medium mb-1 text-gray-700">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="text-lg font-medium mb-1 text-gray-700">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
            required
          />
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-gray-600 text-white rounded-md  hover:shadow-lg focus:scale-105 focus:ring-1"
        >
          Login
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
      </form>
    </div>
    </>
  );
}
