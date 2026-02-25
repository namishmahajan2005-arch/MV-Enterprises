import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from './Components/home'
import Subcategory from './Components/subcategory';
import Product from './Components/product';
import { Searchresult } from './Components/searchresult';
import Checkout from './Components/checkout';
import { Details } from './Components/details';
import Login from './Components/login';
import Register from './Components/register';
import Profile from './Components/profile';
import MyOrders from './Components/myorders';
import OrderDetails from './Components/orderdetails';
import Wishlist from './Components/wishlist';
import Contact from './Components/contact';

function App() {
  
  return(
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/subcategory/:subcategory' element={<Subcategory/>}/>
          <Route path='/subcategory/:subcategory/product/:productId' element={<Product/>}/>
          <Route path='/search' element={<Searchresult/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/checkout/order' element={<Details/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/login/register' element={<Register/>}/>
          <Route path='/profile' element={<Profile/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/orders/:id' element={<OrderDetails />} />
          <Route path='/wishlist' element={<Wishlist/>} />
          <Route path='/contact' element={<Contact/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
