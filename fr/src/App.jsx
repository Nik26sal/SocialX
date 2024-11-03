import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <Navbar />
      <div className='flex'>
        <Footer />
        <Outlet />
      </div>
    </>
  );
}

export default App;
