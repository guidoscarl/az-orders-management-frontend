import { Avatar, Backdrop, BottomNavigation, BottomNavigationAction, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddShoppingCartRoundedIcon from '@mui/icons-material/AddShoppingCartRounded'
import RemoveShoppingCartRoundedIcon from '@mui/icons-material/RemoveShoppingCartRounded';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';

const ProductList = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navigation, setNavigation] = useState("products");
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderFinished, setOrderFinished] = useState(false)

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
  const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

  const handleOrderSubmit = async () => {
    // Qui puoi implementare la logica per inviare l'ordine, ad esempio a un server
    console.log('Ordine inviato:', selectedProduct);
    setOrderLoading(true)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: selectedProduct.productName,
        type: "TECH",
        price: selectedProduct.price,
        userName: "guido"
      })
    }
    await fetch('https://localhost:7106/Orders', requestOptions);
    await delay(2000);
    setOrderLoading(false);
    setOrderFinished(true);
  };

  if (loading) {
    return <p>Caricamento in corso...</p>;
  }

  if (products.length === 0) {
    return <p>Nessun prodotto disponibile.</p>;
  }

  return (
    navigation === "products" ?
      <div>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={orderLoading}

        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <Dialog
          open={orderFinished}
          keepMounted
          onClose={() => { setOrderFinished(false); setSelectedProduct(null) }}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Ordine inviato"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Ordine inviato correttamente!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOrderFinished(false); setSelectedProduct(null) }}>Chiudi</Button>
          </DialogActions>
        </Dialog>
        <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', textAlign: 'center' }}>
          <Typography variant='h4'>Prodotti</Typography>
          <List sx={{ color: 'white', width: '20%', alignSelf: 'center', alignContent: 'center', justifyContent: 'center', alignItems: 'center', justifyItems: 'center', textAlign: 'center' }}>
            {products.map((product) => (
              <div>
                <ListItem style={{ color: 'white', borderRadius: 20, marginBottom: 10, backgroundColor: '#004b66', display: 'flex', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                  <ListItemAvatar>
                    <Avatar>
                      {selectedProduct != null && selectedProduct.productCode === product.productCode ?
                        <IconButton onClick={() => handleProductSelect(product.productCode)} style={{ backgroundColor: 'white', color: 'black' }}>
                          <RemoveShoppingCartRoundedIcon />
                        </IconButton> :
                        <IconButton onClick={() => handleProductSelect(product.productCode)} style={{ backgroundColor: 'white', color: 'black' }}>
                          <AddShoppingCartRoundedIcon />
                        </IconButton>
                      }
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText style={{ color: 'white' }} secondaryTypographyProps={{ color: 'whitesmoke' }} primary={product.productName} secondary={product.price + " €"} />
                </ListItem>
              </div>
            ))}
          </List>


          {selectedProduct != null ?
            <div style={{ width: '30%', marginTop: 60 }}>
              <Typography variant='h4'>Carrello</Typography>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#004b66', width: '100%', color: 'white', borderRadius: 50, margin: 10, padding: 20 }}>

                <Typography variant='h5'>{selectedProduct.productName}</Typography>
                <Typography variant='h7'> {selectedProduct.price} € </Typography>
                <Button variant='outlined' style={{ width: '50%', color: 'white', borderColor: 'white', borderRadius: 50, marginTop: 10 }} onClick={handleOrderSubmit}>Invia Ordine</Button>
              </div>
            </div>
            : null}

        </div>
        <Box sx={{ width: '100%', position: 'fixed', bottom: 1 }}>
          <BottomNavigation
            showLabels
            value={navigation}
            onChange={(event, newValue) => {
              setNavigation(newValue);
            }}
          >
            <BottomNavigationAction value={"products"} label="Products" icon={<AddShoppingCartRoundedIcon />} />
            <BottomNavigationAction value={"myorders"} label="My Orders" icon={<AccountBoxRoundedIcon />} />
          </BottomNavigation>
        </Box>
      </div>
      : <div>
        <Box sx={{ width: '100%', position: 'fixed', bottom: 1 }}>
          <BottomNavigation
            showLabels
            value={navigation}
            onChange={(event, newValue) => {
              setNavigation(newValue);
            }}
          >
            <BottomNavigationAction value={"products"} label="Products" icon={<AddShoppingCartRoundedIcon />} />
            <BottomNavigationAction value={"myorders"} label="My Orders" icon={<AccountBoxRoundedIcon />} />
          </BottomNavigation>
        </Box>
      </div>
  );
};

export default ProductList;