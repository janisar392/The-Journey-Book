import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext';
import NavBar from './components/navigation/NavBar';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Register from './components/login/Register';
import TourList from './components/packages/TourList';
import NewTourItem from './components/packages/NewTourItem';
import Footer from './components/navigation/Footer';
import ExplorePage from './components/ExplorePage';
import ScrollToTop from './components/ScrollToTop';
import OAuthSuccess from './components/login/OAuthSuccess';
import TopDestinations from './components/home/TopDestinations';
import Bookings from './components/home/Bookings';
import Gallery from './components/home/Gallery';
import Contact from './components/home/Contact';
import SearchResultsPage from './pages/SearchResultsPage';
import PlaceDetailsPage from './components/placedetails/PlaceDetailsPage';
import BookingPage from './components/booking/BookingPage';
import BookingConfirmationPage from './components/booking/BookingConfirmationPage';
import MyTripsPage from './components/trips/MyTripsPage';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/add" element={<NewTourItem />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/search-results" element={<SearchResultsPage />} /> {/* Add this line */}
            <Route path="/oauth2-success" element={<OAuthSuccess />} />
            <Route path="/destinations" element={<TopDestinations />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/experience/:id" element={<PlaceDetailsPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
            <Route path="/my-trips" element={<MyTripsPage />} />

          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;