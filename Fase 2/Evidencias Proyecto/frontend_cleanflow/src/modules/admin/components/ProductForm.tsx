/*import { useState, useEffect } from 'react';
import { Button } from '../../../components/atoms/Button';

// Custom Hooks y las interfaces
import { useCategories } from '../../../hooks/useCategories';
import { useBrands } from '../../../hooks/useBrands';

// Estructura del formulario 
export interface ProductFormData {
  nombreProducto: string;
  sku: string;
  precioProducto: number;
  descripcionProducto: string;
  idCategoria: number;
  idMarca: number;
  productoActivo: boolean;
}

interface ProductFormProps {
  initialData?: ProductFormData | null;
  onSubmit: (formData: ProductFormData) => void;
  isSubmitting: boolean;
}

export const ProductForm = ({ initialData, onSubmit, isSubmitting }: ProductFormProps) => {

  // se usan los Custom Hooks para obtener los datos
  const { categories, isLoading: isLoadingCategories, error: errorCategories } = useCategories();
  const { brands, isLoading: isLoadingBrands, error: errorBrands } = useBrands();

  // Determinar el estado de carga y error general
  const isLoading = isLoadingCategories || isLoadingBrands;
  const hasError = errorCategories || errorBrands;

  // Estado del formulario
  const [formData, setFormData] = useState<ProductFormData>({
    nombreProducto: '',
    sku: '',
    precioProducto: 0,
    descripcionProducto: '',
    idCategoria: 0,
    idMarca: 0,
    productoActivo: true,
  });

  // Llenar el formulario si hay datos iniciales o establecer valores por defecto
  useEffect(() => {
    if (initialData) {
        // Modo Edición: Llenar con datos existentes
        setFormData(initialData);
    } else if (!isLoading && categories.length > 0 && brands.length > 0) {
        // Modo Creación y datos cargados: establecer primera opción por defecto
        setFormData(prev => ({
            ...prev,
            // Establecer el primer ID válido si no hay datos iniciales
            idCategoria: categories[0].idCategoria,
            idMarca: brands[0].idMarca
        }));
    }
  }, [initialData, isLoading, categories, brands]); 
  // Manejador de cambios
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } 
    // Los IDs y el precio siempre deben ser tratados como números
    else if (name === 'idCategoria' || name === 'idMarca') {
        setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    }
    else if (type === 'number') {
      // Usamos parseFloat y toLocaleString para manejar la entrada de números
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } 
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Mostrar estados de carga y error

  if (hasError) {
    return <div className="text-red-600 p-4 border border-red-300 rounded-md">
        ⚠️ Error al cargar los datos:
        <p>{errorCategories || errorBrands}</p>
    </div>;
  }
  
  if (isLoading) {
    return <p className="text-lg text-indigo-600">Cargando categorías y marcas...</p>;
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        
        {/* Nombre del Producto */
        /*<div className="sm:col-span-4">
          <label htmlFor="nombreProducto" className="block text-sm font-medium leading-6 text-gray-900">
            Nombre del Producto
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="nombreProducto"
              id="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* SKU */
        /*<div className="sm:col-span-2">
          <label htmlFor="sku" className="block text-sm font-medium leading-6 text-gray-900">
            SKU
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="sku"
              id="sku"
              value={formData.sku}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
        </div>

        {/* Precio */
        /*<div className="sm:col-span-2">
          <label htmlFor="precioProducto" className="block text-sm font-medium leading-6 text-gray-900">
            Precio
          </label>
          <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="precioProducto"
              id="precioProducto"
              value={formData.precioProducto} 
              onChange={handleChange}
              step="0.01" 
              min="0"
              required
              placeholder='0'
              className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300"
            />
          </div>
        </div>

        {/* Categoría (Select) */
        /*<div className="sm:col-span-2">
          <label htmlFor="idCategoria" className="block text-sm font-medium leading-6 text-gray-900">
            Categoría
          </label>
          <div className="mt-2">
            <select
              id="idCategoria"
              name="idCategoria"
              value={formData.idCategoria.toString()} 
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            >
              <option value={0} disabled>Seleccione una categoría</option>
              {categories.map(cat => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nombreCategoria}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Marca (Select) */
        /*<div className="sm:col-span-2">
          <label htmlFor="idMarca" className="block text-sm font-medium leading-6 text-gray-900">
            Marca
          </label>
          <div className="mt-2">
            <select
              id="idMarca"
              name="idMarca"
              value={formData.idMarca.toString()}
              onChange={handleChange}
              required
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            >
              <option value={0} disabled>Seleccione una marca</option>
              {brands.map(marca => (
                <option key={marca.idMarca} value={marca.idMarca}>
                  {marca.nombreMarca}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Descripción */
        /*<div className="col-span-full">
          <label htmlFor="descripcionProducto" className="block text-sm font-medium leading-6 text-gray-900">
            Descripción
          </label>
          <div className="mt-2">
            <textarea
              id="descripcionProducto"
              name="descripcionProducto"
              rows={3}
              value={formData.descripcionProducto}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
            />
          </div>
        </div>

        {/* Producto Activo (Checkbox) */
        /*<div className="col-span-full">
          <div className="relative flex items-start">
            <div className="flex h-6 items-center">
              <input
                id="productoActivo"
                name="productoActivo"
                type="checkbox"
                checked={formData.productoActivo}
                onChange={handleChange}
                className="size-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
            </div>
            <div className="ml-3 text-sm leading-6">
              <label htmlFor="productoActivo" className="font-medium text-gray-900">
                Producto Activo
              </label>
              <p className="text-gray-500">Este producto estará visible en la tienda.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */
      /*<div className="mt-6 flex items-center justify-end gap-x-6">
        <Button 
          type="button" 
          variant="secondary"
          //onClick={() => navigate('/admin/products')}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          variant="primary" 
          disabled={isSubmitting || isLoading} // Deshabilita si se está cargando o enviando
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
        </Button>
      </div>
    </form>
  );
};
*/