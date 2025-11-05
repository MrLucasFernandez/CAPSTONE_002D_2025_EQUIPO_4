import { Outlet } from 'react-router-dom';
import  Navbar  from '../organisms/Navbar';
import  {Footer}  from '../organisms/Footer';

export const PublicLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};