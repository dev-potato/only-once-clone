import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import euro from "../assets/Euro_symbol_white.svg";
import Footer from "../components/footer";
import {getAll} from '../ducks/reducer'
import ProductTile from './productTile'



import { addToCart } from '../ducks/reducer'

import '../styles/products.scss'

 class Products extends Component { 
    constructor(props) {
        super(props)

        this.state = {
            isHovering: false
        }

        // this.getMeTheProducts = this.getMeTheProducts.bind(this)
    }

    // componentWillMount() {
    //     axios.get('/api/products').then(products => {
    //         console.log(products.data)
    //         let pd = products.data
    //         return pd
    //     }, (pd) => this.props.getAll(pd)).catch()
    // }

    //  getMeTheProducts() {
    //      const productList = this.props.products.map((product, index) => {
    //          return (
    //              <Link to={`product/${product.item_name}/${product.item_number}`}>
    //                  <div className="product-card" key={product.item_number}>
    //                      <div className='product-hover'>
    //                          <span>{product.item_name}</span>
    //                          <span className='price-line'><div className='red-dot'></div>{`${product.price}`}<img className='euro' src={euro} alt="" /></span>
    //                      </div>
    //                      <div className="image-parent">
    //                          <div className="image-container">

    //                              <img src={product.display_photo} alt="" />
    //                          </div>
    //                      </div>
    //                  </div>
    //              </Link>
    //          )
    //      })
    //      return productList
    //  }


  

    

    // getMeTheProducts = () =>  {
    //     console.log(this.state.isHovering)
        
    //     return productList;
    // }

    render() {
        // console.log(document.location)
        console.log(document.location)

        // let productList = this.props.products.map( (product, i) => <ProductTile key={product.item_id} product={product} /> )
        
        let filterList = this.props.products.filter( product => {
            // console.log(product)

             if (document.location.hash === '#/store/lights') {
                return product.item_type === 'lamp' || product.item_type === 'light' 
            } else if (document.location.hash === '#/store/industrial') {
                return product.item_type === "industrial"
            } else if (document.location.hash === '#/store/sold') {
                return product.sold 
            } else if (document.location.hash === '#/store/electronic') {
                return product.item_type === 'electronic'
            } else if (document.location.hash === '#/store/clocks') {
                return product.item_type === 'clock'
            } else if (document.location.hash === '#/store/home-deco') {
                return product.item_type === 'homedeco'
            }
            
            return true 
        })
        
        let productList = filterList.map( (product, i) => <ProductTile key={product.item_id} product={product} /> )


        return (
            <div className={ (this.props.className) ? this.props.className : "product-parent" }>
          <div className={ 'product-wrapper' }>

          {
              
              (!this.props.loading)

              ?

              <div className= "products" >
              { productList }
               <Footer />
               </div>
               
               :
               
               <h1>Loading Products!</h1>
               
            }
            </div>
          </div>
        )
    }
 }



 const mapStateToProps = (state) => {
     if( !state ) {
         return {}
     } else {
     let { products, cart, loading }  = state.customerReducer
     return {
         products: products,
         cart: cart,
         loading: loading
     }
    
 }
}

 export default withRouter(connect(mapStateToProps, {  addToCart, getAll })(Products))