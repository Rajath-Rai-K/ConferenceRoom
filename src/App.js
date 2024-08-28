// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './screens/Login';
import Registration from './screens/Registration';
import LandingPage from './screens/LandingPage';
import BookingForm from './screens/BookingForm';
import RoomList from './screens/RoomList';
import AdminDashboard from './screens/AdminDashboard';
import MyBooking from './screens/MyBooking';
import CompanyBookings from './screens/CompanyBookings';
//import { UserBookingDetails } from './screens/UserBookingDetails';


function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/RoomList" element={<RoomList />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/booking/:id" element={<BookingForm />} />
        <Route path="/myBookings" element={<MyBooking />} />
        <Route path="/companyBookings" element={<CompanyBookings />} />

        {/* <Route path="/userBookingDetails" element={<UserBookingDetails />} /> */}

        
    
        

      </Routes>
    </Router>
  );
}

export default App;
