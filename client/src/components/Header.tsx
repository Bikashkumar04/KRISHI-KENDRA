import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">KRISHI KENDRA</h1>
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/mandi-price" className="nav-link">Mandi Price</Link>
          <Link to="/weather" className="nav-link">Weather</Link>
          <Link to="/government-schemes" className="nav-link">Government Schemes</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
