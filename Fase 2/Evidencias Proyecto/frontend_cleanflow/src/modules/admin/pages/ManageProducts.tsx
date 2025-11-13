// src/modules/admin/pages/ManageProducts.tsx

/*import { Link } from 'react-router-dom';
import { ProductsTable } from '../components/ProductsTable';
import { useAdminProducts } from '../hooks/useAdminProducts'; // <-- Usamos el hook refactorizado
import { Button } from '../../../components/atoms/Button'; 

export const ManageProducts = () => {
  
  // 1. Usamos el hook refactorizado (obtenemos los datos y las funciones de acción)
  const { products, isLoading, error, deleteProduct } = useAdminProducts();

  // 2. Definimos las funciones de acción
  const handleEdit = (id: number) => {
    // Redirigir usando el ID
    console.log(`Editando producto ${id}`);
    // navigate(`/admin/productos/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }
    try {
      // 🚨 Llamada a la función deleteProduct del hook
      await deleteProduct(id);
      console.log(`Producto ${id} eliminado exitosamente.`);
    } catch (err) {
      alert("Error al eliminar el producto. Revise la consola.");
      console.error("Error de eliminación en UI:", err);
    }
  };

  // 3. Manejamos los estados de carga y error
  if (isLoading) {
    return <div className="p-10">Cargando productos...</div>;
  }

  // Manejo de errores de carga inicial
  if (error) {
    const errorMessage = error.message.includes('401') 
      ? 'Sesión expirada o permisos insuficientes. Por favor, recargue la página.'
      : error.message;

    return <div className="p-10 text-red-500">Error al cargar productos: {errorMessage}</div>;
  }

  // 4. Renderizamos la página
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Productos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Administra los productos de tu tienda, incluyendo inventario, precios y categorías.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link to="/admin/productos/crear">
            <Button variant="primary">
              Agregar Producto
            </Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <ProductsTable 
          products={products} 
          onEdit={handleEdit} 
          onDelete={handleDelete} // Pasa la nueva función asíncrona
        />
      </div>
    </div>
  );
};*/