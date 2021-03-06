import React, { Component } from 'react'
import {connect} from 'react-redux'
import ProductList from './productList'
import ProductTile from './productTile'
import Navbar from './navbar'
import Footer from './footer'
import logo from '../assets/images/only_once_logo.svg'
import { getAll } from '../ducks/reducer'
import '../styles/store.scss'
import EmailCard from './emailCard'
import InfiniteScroll from './infinite-scroll/scroller'

 class Store extends Component {
     constructor(props) {
         super(props)

         this.state = {
             totalOffset: window.innerHeight,
         }
     }

componentDidMount() {
    this.props.getAll()
}

    render() {
        return(
            <div className='store-parent'>
                <Navbar
                    path={this.props.location.pathname}
                    logo={logo}
                    stick={this.props.isSticky}
                    cart={this.props.cart}
                    width={window.innerWidth}/>
                <div><span>{ (window.location.hash !== '#/store') ? `${this.props.products[0].item_type} View` : 'Whole Selection' }</span></div>
                <div className='product-store-wrapper'>
                <ProductList 
                 location={this.props.match}
                 className='store-view'/>
                 <EmailCard />
                </div>
                <div className='infinite-wrapper'>
                    <InfiniteScroll 
                        totalOffset={this.state.totalOffset * 3.3}
                    />
                </div>
                 <div>
                    <Footer />
                 </div>
            </div>
        )
    }
}

let mapStateToProps = (state) => {
    return {
        products: state.customerReducer.products,
        cart: state.customerReducer.cart,
        isSticky: state.customerReducer.isSticky
    }
}

export default connect(mapStateToProps, { getAll })(Store)