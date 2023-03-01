import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import { FaUser } from "react-icons/fa";


import { logout } from '../services/MockAuthService';

import './console-navbar.css';
import logo from './logo.png';

function ConsoleNavbar() {
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth.getSession();
  const items = [
    { "path": "/console", "title": "Daily Values" },
    { "path": "/console/apps", "title": "Next Morning Values" },
  ]

  const handleLogout = async (e) => {
    e.preventDefault();

    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top bg-dark p-1 shadow">
      <div className="d-flex flex-grow-1">
          <img src={logo} />
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav">
            {
              items.map((item, i) => (
                <li key={i} className="nav-item">
                  <NavLink className="nav-link" to={item.path}>{item.title}</NavLink>
                </li>
              ))
            }
          </ul>
        </div>

        <div className="collapse navbar-collapse flex-grow-1 text-right" id="navbarDropdown">
          <ul className="navbar-nav ms-auto flex-nowrap">
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle nav-avatar-dropdown"
                      id="dropdownMenu"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
              >
              {user.username}  <FaUser />
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenu">
                <li>
                  <a className="dropdown-item" href='/console/profile'>Profile</a>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default ConsoleNavbar;
