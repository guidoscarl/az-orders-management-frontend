import React, { useState, useEffect } from 'react';

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Start fetch')
        const response = await fetch('https://localhost:7106/Products');
        if (!response.ok) {
          throw new Error('Errore nel recupero dei prodotti');
        }
        console.log('End fetch')
        const data = await response.json();
        console.log(data);
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Errore durante la richiesta API:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); // L'array vuoto indica che useEffect verrà eseguito solo al montaggio del componente
  const handleProductSelect = (productId) => {
    const existingProduct = selectedProduct != null && selectedProduct.productCode === productId;

    if (existingProduct) {
      // Rimuovi il prodotto se è già presente nel carrello
      setSelectedProduct(null);
    } else {
      // Aggiungi il prodotto se non è presente nel carrello
      const selectedProduct = products.find((product) => product.productCode === productId);
      setSelectedProduct(selectedProduct);
    }
  };

  const handleOrderSubmit = () => {
    // Qui puoi implementare la logica per inviare l'ordine, ad esempio a un server
    console.log('Ordine inviato:', selectedProduct);
  };

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (products.length === 0) {
    return <p>Nessun prodotto disponibile.</p>;
  }

  return (
    <div>
      <h2>Lista Prodotti</h2>
      <ul>
        {products.map((product) => (
          <li key={product.productCode}>
            {product.type} - {product.productName} - {product.price} €{' '}
            <button onClick={() => handleProductSelect(product.productCode)}>
              {selectedProduct != null && selectedProduct.productCode === product.productCode ? 'Rimuovi dal carrello' : 'Aggiungi al carrello'}
            </button>
          </li>
        ))}
      </ul>

      <h2>Carrello</h2>
          {selectedProduct != null ? <p>{selectedProduct.productName} - {selectedProduct.price} € </p> : null}
      <button onClick={handleOrderSubmit}>Invia Ordine</button>
    </div>
  );
};

export default ProductList;