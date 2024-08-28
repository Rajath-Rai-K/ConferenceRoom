import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import bcrypt from 'bcryptjs';

export default function Registration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyId: '',
    roleId: '4',
  });

  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/company-name');
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const empData = {
      username: formData.username,
      email: formData.email,
      password: hashedPassword,
      company: {
        id: formData.companyId
      },
      role: {
        id: formData.roleId
      },
    };

    try {
      console.log("Sending data");
     // console.log(empData);

      const response = await axios.post('http://localhost:8080/api/users', empData);
      //console.log(response.data);

      // setFormData({
      //   username: '',
      //   email: '',
      //   password: '',
      //   confirmPassword: '',
      //   companyId: '',
      //   roleId: '4',
      // });

      alert("Registration successful! You may proceed to login now.");
      navigate('/login');
      
    } catch (error) {
      if (error.response && error.response.status === 500) {
        const userConfirmed = window.confirm("This email is already registered. Do you want to log in?");
        if (userConfirmed) {
          navigate(`/login?email=${encodeURIComponent(formData.email)}`);
        }
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Header />
      <div className="mt-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-700">User Registeration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="username" className="text-lg font-medium mb-1 text-gray-700">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100 "
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-medium mb-1 text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-lg font-medium mb-1 text-gray-700">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="text-lg font-medium mb-1 text-gray-700">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="companyId" className="text-lg font-medium mb-1 text-gray-700">Company Name:</label>
            <select
              name="companyId"
              id="companyId"
              value={formData.companyId}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-100  "
              required
            >
              <option value="" disabled>Select a company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            {/* <label htmlFor="roleId" className="text-lg font-medium mb-1 text-gray-700">Role:</label> */}
            {/* <select
              name="roleId"
              id="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transform transition-transform duration-200 ease-in-out hover:shadow-lg focus:scale-105"
              required
            >
              <option value="" disabled>Select a role</option>
              <option value="4">User</option>
              {/* <option value="2">Admin</option> */}
            {/* </select> */} 
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-gray-600 text-white rounded-md  focus:ring-1 focus:ring-blue-100"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <Link to="/" className="text-blue-500">Login</Link>
        </p>
      </div>
    </>
  );
}
