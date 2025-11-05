import { Outlet } from 'react-router-dom';
import  Navbar  from '../organisms/Navbar';
import  {Footer}  from '../organisms/Footer';

// Outlet es un marcador de posición de react-router
// que dice: "aquí es donde se renderizarán las rutas hijas"
// (HomePage, LoginPage, etc.)
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