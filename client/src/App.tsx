import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Home from './pages/Home.tsx';
import MandiPricePage from './pages/MandiPrice.tsx';
import Weather from './pages/Weather.tsx';
import GovernmentSchemes from './pages/GovernmentSchemes.tsx';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mandi-price" element={<MandiPricePage />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/government-schemes" element={<GovernmentSchemes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
