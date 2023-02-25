import { NavLink } from 'react-router-dom';

import './navbar.css';
import logo from './doughbooks.png';

function MainNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand d-flex pt-2" href="/">
          eDoughBooks
        </a>
        <button className="navbar-toggler collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarMenu"
                aria-controls="navbarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"/>
        </button>
      </div>
    </nav>
  );
}

export default MainNavbar;
