import  {Product}  from '../hooks/useAdminProducts'; // Importamos el tipo
import  {Link } from 'react-router-dom';

interface ProductsTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

export const ProductsTable = ({ products, onDelete, onEdit }: ProductsTableProps) => {
  return (
    <div className="flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-300">
            {/* Encabezado de la tabla */}
            <thead>
              <tr>
                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">Nombre</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">SKU</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Categoría</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Precio</th>
                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            
            {/* Cuerpo de la tabla */}
            <tbody className="divide-y divide-gray-200 bg-white">
              {products.map((product) => (
                <tr key={product.idProducto}>
                  <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
                    <div className="font-medium text-gray-900">{product.nombreProducto}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{product.sku}</td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">{product.categoriaNombre}</td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">${product.precioProducto}</td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
                    {product.productoActivo ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    {/* Botones de acción. 'onEdit' lo veremos en el paso "Update" */}
                    <Link to={`/admin/productos/editar/${product.idProducto}`}>
                      <button
                        onClick={() => onEdit(product.idProducto)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Editar
                      </button>
                    </Link>
                    
                    <button
                      onClick={() => onDelete(product.idProducto)}
                      className="ml-4 text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};