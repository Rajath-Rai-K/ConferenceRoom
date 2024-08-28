import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from '../axiosConfig';
import moment from 'moment-timezone';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../components/Header';

const BookingForm = () => {
    const { id: roomId } = useParams();
    const location = useLocation(); // Get the current location object
    const searchParams = new URLSearchParams(location.search); // Extract search params
    const bookingDate = searchParams.get('date');
    const sTimeParam = searchParams.get('startTime');
    const eTimeParam = searchParams.get('endTime');
    // Function to convert bookingDate from MM/DD/YYYY to YYYY-MM-DD
    const parseBookingDate = (date) => {
        return moment(date, 'M/D/YYYY').format('YYYY-MM-DD');
    };

    // // Function to create a DateTime object
    const createDateTime = (date, time) => {
        // Check if the time format is "HH:mm"

        if (time ) {
            // Combine date and time
            const dateTimeString = `${date}T${time}:00`; // e.g., "2024-08-28T09:00:00"
            return moment.tz(dateTimeString, 'Asia/Kolkata'); // Convert to IST timezone
        } else {
            return null; // Handle invalid time format
        }
    };
    // Parse and combine date and time
    const parsedDate = parseBookingDate(bookingDate);
    const startDateTime = createDateTime(parsedDate, sTimeParam);
    const endDateTime = createDateTime(parsedDate, eTimeParam);
    const [startTime, setStartTime] = useState('');
    const [startTimes, setStartTimes] = useState([]);
    const [endTimes, setEndTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [minDate, setMinDate] = useState(new Date());
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false); // Add isUpdate state
    const navigate = useNavigate();


    let userData = localStorage.getItem('userDetails')
    let user_id= JSON.parse(userData);

    useEffect(() => {
        const fetchCurrentDateTime = () => {
            const now = moment().tz('Asia/Kolkata'); // IST time zone
            setCurrentDateTime(now.format('YYYY-MM-DDTHH:mm:ss')); // Full date-time string
            
            // Set current date for the date picker
           //setMinDate(new Date());
           setSelectedDate(new Date());
        };

        fetchCurrentDateTime();
    }, []);

    useEffect(() => {
        // Check if search params contain startTime and endTime
        if (sTimeParam && eTimeParam) {
            setIsUpdate(true);
            setSelectedDate(new Date(bookingDate))
        } else {
            setIsUpdate(false);
        }
    }, [sTimeParam, eTimeParam]);

    useEffect(() => {
        if (selectedDate && currentDateTime) {
            const fetchStartTimes = async () => {
                try {// Extract date parts
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    
                    const formattedDate = `${year}-${month}-${day}`;
                    const params = {
                        roomId,
                        date: formattedDate,
                        currentDateTime,
                        isUpdate
                    };
                    
                    // Conditionally add sTime and eTime if initialStartTime is set
                    if (isUpdate) {
                        params.sTime = startDateTime.format('YYYY-MM-DDTHH:mm:ss');
                        params.eTime = endDateTime.format('YYYY-MM-DDTHH:mm:ss');
                    }
                    const response = await axios.get('/api/bookings/available-start-times', { params });
                    const availableTimes = Array.isArray(response.data) ? response.data : [];
                    
                    if (availableTimes.length === 0) {
                        if (formattedDate === moment().format('YYYY-MM-DD')) {
                            const now = moment().tz('Asia/Kolkata');
                            // Create a moment object for 20:45 (8:45 PM) on the current day
                            const cutoffTime = moment().tz('Asia/Kolkata').set({ hour: 20, minute: 45, second: 0, millisecond: 0 });

                            // Check if the current time is pasto 20:45
                            if (now.isAfter(cutoffTime)) {
                                alert('It is past 8:45 PM, so the booking date has been set to the next day.');
                                const nextDay = new Date(selectedDate);
                                nextDay.setDate(nextDay.getDate() + 1);
                                setSelectedDate(nextDay);
                            } else {
                                alert("The room is fully booked for today. Automatically shifting to tomorrow.");
                                const nextDay = new Date(selectedDate);
                                nextDay.setDate(nextDay.getDate() + 1);
                                setSelectedDate(nextDay);
                            }
                        } else {
                            alert('No available slots for this date. Automatically moving to the next available date.');
                            const nextDay = new Date(selectedDate);
                            nextDay.setDate(nextDay.getDate() + 1);
                            setSelectedDate(nextDay);
                        }
                        setStartTimes([]);
                        setEndTimes([]);
                    } else {
                        setStartTimes(availableTimes);
                    }
                } catch (error) {
                    setError('There are no available slots for this date.');
                    console.error('Error fetching start times:', error);
                    setStartTimes([]); // Set to empty array on error
                }
            };

            fetchStartTimes();
        } else {
            setStartTimes([]); // Clear start times if after 8:45 PM
            setEndTimes([]);
        }
    }, [selectedDate, currentDateTime, roomId]);

    useEffect(() => {
        const fetchEndTimes = async () => {
            if (startTime && selectedDate) {
                try {
                    const year = selectedDate.getFullYear();
                    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
                    const day = String(selectedDate.getDate()).padStart(2, '0');
                    
                    const formattedDate = `${year}-${month}-${day}`;
                    const response = await axios.get('/api/bookings/available-end-times', {
                        params: {
                            roomId,
                            date: formattedDate,
                            startTime
                        }
                    });
                    setEndTimes(Array.isArray(response.data) ? response.data : []); // Ensure it's an array
                } catch (error) {
                    setError('Failed to fetch available end times.');
                    console.error('Error fetching end times:', error);
                    setEndTimes([]); // Set to empty array on error
                }
            }
        };

        fetchEndTimes();
    }, [startTime, selectedDate, roomId]);

    const handleStartTimeChange = (e) => {
        setStartTime(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Prepare booking details for modal
        const endTime = e.target['end-time'].value;
        const booking = {
            roomId,
            startTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${startTime}:00`).toISOString(),
            endTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${endTime}:00`).toISOString(),
        };
        const duration = moment(booking.endTime).diff(moment(booking.startTime), 'minutes');

        setBookingDetails({
            roomId,
            startTime: moment(booking.startTime).format('HH:mm'),
            endTime: moment(booking.endTime).format('HH:mm'),
            date: moment(selectedDate).format('YYYY-MM-DD'),
            duration
        });
        setShowModal(true);
    };

    const handleConfirmBooking = async () => {
        if (bookingDetails) {
            const formattedStartTime = moment(`${bookingDetails.date}T${bookingDetails.startTime}`, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndTime = moment(`${bookingDetails.date}T${bookingDetails.endTime}`, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm:ss');
    
            let bookingData = {
                room: {
                    id: bookingDetails.roomId
                },
                user: {
                    id: user_id // Make sure user_id is defined in your component or passed as a prop
                },
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                createdAt: null,
                updatedAt: null
            };
    
            try {
                console.log(bookingData); // This logs the booking data for debugging purposes
                await axios.post('/api/bookings', bookingData);
                alert('Booking successful!');
                navigate('/RoomList')
                
            } catch (error) {
                console.error('Booking failed:', error); // Log the error for debugging
                alert('Booking failed.');
            }
            setShowModal(false);
        }
    };

    const handleUpdateBooking = async () => {
        if (bookingDetails) {
            const formattedStartTime = moment(`${bookingDetails.date}T${bookingDetails.startTime}`, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm:ss');
            const formattedEndTime = moment(`${bookingDetails.date}T${bookingDetails.endTime}`, 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DDTHH:mm:ss');
    
            let bookingData = {
                room: {
                    id: bookingDetails.roomId
                },
                user: {
                    id: user_id // Make sure user_id is defined in your component or passed as a prop
                },
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                createdAt: null,
                updatedAt: null
            };
    
            try {
                console.log(bookingData); // This logs the booking data for debugging purposes

                await axios.put('/api/bookings' , bookingData, 
                    {
                        params: {
                            roomId,
                            startTime: startDateTime.format('YYYY-MM-DDTHH:mm:ss')
                        }
                    });
                alert('Booking successfully updated!');
                navigate('/RoomList')
                
            } catch (error) {
                console.error('Booking update failed:', error); // Log the error for debugging
                alert('Booking failed to update.');
            }
            setShowModal(false);
        }
    };
    

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
            <Header />
            <div className="mt-10 max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500">{error}</p>}
                    
                    <div className="flex flex-col">
                        <label htmlFor="date" className="text-lg font-medium mb-1 text-gray-700">Booking Date:</label>
                        <DatePicker
                            id="date"
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="yyyy-MM-dd"
                            minDate={minDate}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="start-time" className="text-lg font-medium mb-1 text-gray-700">Start Time:</label>
                        <select
                            id="start-time"
                            value={startTime}
                            onChange={handleStartTimeChange}
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={startTimes.length === 0}
                        >
                            <option value="">Select Start Time</option>
                            {startTimes.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col">
                        <label htmlFor="end-time" className="text-lg font-medium mb-1 text-gray-700">End Time:</label>
                        <select
                            id="end-time"
                            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            disabled={endTimes.length === 0}
                        >
                            <option value="">Select End Time</option>
                            {endTimes.map((time, index) => (
                                <option key={index} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    {(!isUpdate) ? (<button
                        type="submit"
                        className="w-full p-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={startTimes.length === 0}
                    >
                        Book
                    </button>
                    ): (<button
                        type="submit"
                        className="w-full p-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={startTimes.length === 0}
                    >
                        Update
                    </button>)}
                </form>

                {showModal && bookingDetails && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto">
                            <h2 className="text-xl font-bold mb-4">Conference Room {bookingDetails.roomId}</h2>
                            <p className="mb-2"><strong>Start Time:</strong> {bookingDetails.startTime}</p>
                            <p className="mb-2"><strong>End Time:</strong> {bookingDetails.endTime}</p>
                            <p className="mb-2"><strong>Booking Date:</strong> {bookingDetails.date}</p>
                            <p className="mb-4"><strong>Duration:</strong> {bookingDetails.duration} minutes</p>
                            <div className="flex justify-between space-x-4">
                                {(!isUpdate) ? (<button
                                    onClick={handleConfirmBooking}
                                    className=" w-full p-2 bg-green-500 text-white rounded-md "
                                >
                                    Confirm Booking
                                </button>
                                ) : (<button
                                    onClick={handleUpdateBooking}
                                    className=" w-full p-2 bg-green-500 text-white rounded-md "
                                >
                                    Update Booking
                                </button>)}
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full p-2 bg-red-500 text-white rounded-md "
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default BookingForm;
