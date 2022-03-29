import styles from './Checkout.module.css';
import { LoadingIcon } from './Icons';
import { getProducts } from './dataService';
import React from 'react'

// You are provided with an incomplete <Checkout /> component.
// You are not allowed to add any additional HTML elements.
// You are not allowed to use refs.

// Demo video - You can view how the completed functionality should look at: https://drive.google.com/file/d/1o2Rz5HBOPOEp9DlvE9FWnLJoW9KUp5-C/view?usp=sharing

// Once the <Checkout /> component is mounted, load the products using the getProducts function.
// Once all the data is successfully loaded, hide the loading icon.
// Render each product object as a <Product/> component, passing in the necessary props.
// Implement the following functionality:
//  - The add and remove buttons should adjust the ordered quantity of each product
//  - The add and remove buttons should be enabled/disabled to ensure that the ordered quantity can’t be negative and can’t exceed the available count for that product.
//  - The total shown for each product should be calculated based on the ordered quantity and the price
//  - The total in the order summary should be calculated
//  - For orders over $1000, apply a 10% discount to the order. Display the discount text only if a discount has been applied.
//  - The total should reflect any discount that has been applied
//  - All dollar amounts should be displayed to 2 decimal places



const Product = ({ id, name, availableCount, price, orderedQuantity, total, onAdd, onSubstract, canAdd, canSubstract }) => {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{availableCount}</td>
      <td>${price}</td>
      <td>{orderedQuantity}</td>   
      <td>${total}</td>
      <td>
        <button className={styles.actionButton} style={ { opacity: canAdd(id) ? '' : '20%' } } onClick={() => onAdd(id)}>+</button>
        <button className={styles.actionButton} style={ { opacity: canSubstract(id) ? '' : '20%' } } onClick={() => onSubstract(id)}>-</button>
      </td>
    </tr>    
  );
}


const Checkout = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [products, setProducts] = React.useState([])
  const TEN_PERCENT_DISCOUNT = 0.10

  React.useEffect(() => {
      setIsLoading(true)
      getProducts()
        .then(response => {
          console.log(response)
          setProducts(response.map(product => ({
            ...product, orderedQuantity: 0, total: '0.00', hasDiscount: false
          })))
        })
        .finally(() => setIsLoading(false))
  }, [])

  const canAddProduct = (productId) => {
      const product = products.find(product => productId === product.id)
      const newQuantity = product.orderedQuantity + 1
      if (newQuantity > product.availableCount)
        return false
      else return true
  }
  const canSubstractProduct = (productId) => {
    const product = products.find(product => productId === product.id)
    const newQuantity = product.orderedQuantity - 1
      if (newQuantity < 0)
        return false
      else return true
  }


  const addProduct = (productId) => {
    if (canAddProduct(productId))
      setProducts((prevValue) => {
        return prevValue.map(product => {
            const newQuantity = product.orderedQuantity + 1
            const newTotal = (parseFloat(product.price) * newQuantity)
            const total = newTotal > 1000 && !product.hasDiscount ? (newTotal - newTotal * TEN_PERCENT_DISCOUNT) : newTotal
            return {
              ...product,
              orderedQuantity: product.id === productId ? newQuantity : product.orderedQuantity,
              total: product.id === productId ? total.toFixed(2) : product.total,
              hasDiscount: newTotal > 1000
            }
        }
        )
      })
  }

  const substractProduct = (productId) => {
    if (canSubstractProduct(productId))
      setProducts((prevValue) => {
        return prevValue.map(product => {
            const newQuantity = product.orderedQuantity - 1
            const newTotal = (parseFloat(product.price) * newQuantity)
            const total = newTotal > 1000 && !product.hasDiscount ? (newTotal - newTotal * TEN_PERCENT_DISCOUNT) : newTotal
            return {
              ...product,
              orderedQuantity: product.id === productId ? newQuantity : product.orderedQuantity,
              total: product.id === productId ? total.toFixed(2) : product.total,
              hasDiscount: total > 1000
            }
        }
        )
      })
  }

  const getTotal = () => {
    return products.reduce((currentTotal, product) => {
        return (parseFloat(product.total) + parseFloat(currentTotal)).toFixed(2)
    }, '0.00')
  }

  return (
    <div>
      <header className={styles.header}>        
        <h1>Electro World</h1>        
      </header>
      <main>
        {
          isLoading 
            ? <>
              <LoadingIcon />        
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {/* Products should be rendered here */}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ </p>
        <p>Total: $ </p>      
            </>
            : <>
              <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Product Name</th>
              <th># Available</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {products.map((product) => <Product key={product.id} {...product} onAdd={addProduct} onSubstract={substractProduct} canAdd={canAddProduct} canSubstract={canSubstractProduct} />)}
          </tbody>
        </table>
        <h2>Order summary</h2>
        <p>Discount: $ </p>
        <p>Total: ${getTotal()} </p> 
            </>
        } 
      </main>
    </div>
  );
};

export default Checkout;