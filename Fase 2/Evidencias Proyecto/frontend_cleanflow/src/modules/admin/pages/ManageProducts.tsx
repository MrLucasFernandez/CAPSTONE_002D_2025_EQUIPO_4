import { Link } from 'react-router-dom';
import { ProductsTable } from '../components/ProductsTable';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { Button } from '../../../components/atoms/Button'; // Nuestro átomo!

export const ManageProducts = () => {
  // 1. Usamos el hook para obtener los datos y el estado
  const { products, isLoading, error } = useAdminProducts();

  // 2. Definimos las funciones de acción (por ahora solo un console.log)
  const handleEdit = (id: number) => {
    // En el futuro, esto navegará a la página de edición
    console.log(`Editar producto ${id}`);
    // navigate(`/admin/products/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    // En el futuro, esto llamará a la API para borrar
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      console.log(`Eliminar producto ${id}`);
      // Lógica de borrado...
    }
  };

  // 3. Manejamos los estados de carga y error
  if (isLoading) {
    return <div className="p-10">Cargando productos...</div>;
  }

  if (error) {
    // 💡 SOLUCIÓN: Si 'error' es un objeto con 'message' usamos esa propiedad, si no lo convertimos a string.
    const errorMessage =
      error && typeof error === 'object' && 'message' in error
        ? String((error as { message: unknown }).message)
        : String(error);

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
          {/* Este botón es nuestro átomo y nos lleva a la página "Create" 
            que construiremos en el siguiente paso.
          */}
          <Link to="/admin/productos/crear">
            <Button variant="primary">
              Agregar Producto
            </Button>
          </Link>
        </div>
      </div>

      {/* Renderizamos nuestro organismo de tabla, pasándole los datos */}
      <div className="mt-8">
        <ProductsTable 
          products={products} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />
      </div>
    </div>
  );
};