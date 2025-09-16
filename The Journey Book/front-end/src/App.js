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
import ScrollToTop from './components/ScrollToTop'; // Import the ScrollToTop component

// Import the components you just created
import TopDestinations from './components/home/TopDestinations';
import Bookings from './components/home/Bookings';
import Gallery from './components/home/Gallery';
import Contact from './components/home/Contact';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop /> {/* Add ScrollToTop component here */}
          <NavBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tours" element={<TourList />} />
            <Route path="/add" element={<NewTourItem />} />
            <Route path="/explore" element={<ExplorePage />} />
            
            {/* Add these new routes */}
            <Route path="/destinations" element={<TopDestinations />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;