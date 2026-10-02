import { Outlet } from 'react-router-dom';
import Nav from '../Navigation/Nav';
import Footer from '../Navigation/Footer';
import DSAAssistant from '../Assistant/DSAAssistant';
import './Layout.css';

export default function Layout() {
  return (
    <div className="app-layout">
      <Nav />
      <main className="main-content">
        <Outlet />
      </main>
      <DSAAssistant />
      <Footer />
    </div>
  );
}

