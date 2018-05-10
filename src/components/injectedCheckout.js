import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import {connect} from 'react-redux'
import '../styles/checkout.scss'
import axios from 'axios'
import { modalEngaged } from '../ducks/reducer'


 class CardSection extends Component {
     constructor(props) {
         super(props)

         this.state = {
             value: false
         }

         this.handleSubmit = this.handleSubmit.bind(this)
     }


    handleSubmit = (event) => {

        this.setState({
            value: !this.state.value
        })

        this.props.modalEngaged(this.state.value)

        let message = 'Thank you for choosing Clone Once. Your order is on its way! '

        event.preventDefault();

        this.props.stripe.createToken( {name: `${this.props.billingFirstName} ${this.props.billingLastName}` } ).then(({token}) => {
            console.log(token)
            axios.post('/api/charge', {amount: +this.props.cartTotal, stripeToken: token.id}).then(
                axios.post('api/confirmationEmail', {user_email: this.props.billingEmail, message: message } ).then(
                    axios.post('/api/sendText', { user_phone_number: this.props.billingPhone, message: message }).then(

                        

                        console.log('Email Sent, text sent, and order Confirmed.')
                    ).catch()
                ).catch()
            ).catch()
        }).catch()
        
    }

    render() {

        console.log(this.props)

        return(
            <div className='stripe'>
                <div>Please enter your payment details below.</div>
                <CardElement
                    className='StripeElement'/>
                <div className='stripe-submit' onClick={(event) => this.handleSubmit(event)}>Submit Payment</div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    
    return {
        stripeToken: state.stripeToken,
        billingFirstName: state.billingFirstName,
        billingLastName: state.billingLastName,
        cartTotal: state.cartTotal,
        billingEmail: state.billingEmail,
        billingPhone: state.billingPhone,
        modalView: state.modalView
    }
}

export default injectStripe(connect( mapStateToProps, { modalEngaged } )(CardSection))