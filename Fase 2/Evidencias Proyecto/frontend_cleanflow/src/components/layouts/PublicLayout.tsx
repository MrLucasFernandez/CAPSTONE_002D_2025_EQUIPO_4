import { Outlet } from 'react-router-dom';
import  Navbar  from '@/components/organisms/home/Navbar';
import  {Footer}  from '@/components/organisms/home/Footer';

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