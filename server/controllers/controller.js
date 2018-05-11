const {
    DEV_EMAIL,
    DEV_EMAIL_PASSWORD,
    TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_NUMBER
} = process.env

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const nodemailer = require('nodemailer')
const accountSid = 'AC4c3d0204697692f584917c3e05030392'
const authToken = TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken)



const transport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: DEV_EMAIL,
        pass: DEV_EMAIL_PASSWORD
    }
})
// let session_id = 1;
module.exports = {
    // validateSession: (req, res, next) => {
    //     console.log('controller', req.session.user)
    //     if( !req.session.user.session_id ) {
    //         req.session.user.session_id = session_id
    //         session_id++;
    //         console.log(req.session.user)
    //     }
    //     res.status(200).send()
    //     let current_session = req.session.user.session_id;        
    //     if(req.session.user.session_id) {
    //         res.status(200).send({ sessionId: current_session })
    //     } else {
    //         res.status(500)

    //   }
    // },
    getProducts: (req, res, next) => {
        // console.log('gp', req.session.user )
        const db = req.app.get('db')
        db.getProducts().then( products => {
            res.status(200).send(products)
        }).catch(500)
    },
    addProduct: (req, res, next) => {
        const db = req.app.get('db')
        db.checkProductDB( [ +req.body.id ] ).then( product => {
                    // req.session.user.cart.push(+product[0].item_number)
                    // console.log('cart', req.session.user)               
                    res.status(200).send(product[0])
        }).catch(500)
    },
    // request product details for detail page
    productDetails: (req, res, next) => {
        const db = req.app.get('db');
        console.log(req.body)
        db.productDetails([ +req.body.productId ]).then( product => {
            res.status(200).send(product[0])
        }).catch(500)
    },
    // stripe payment object
    payment: (req, res, next) => {
        let token = req.body.stripeToken;
        let chargeAmount = stripe.charges.create({
            amount: req.body.amount * 100,
            currency: 'eur',
            source: token
        }, function(err, charge) {
            if(err === "StripeCardError"){
                console.log("Your card was declined...")
            }
        });
        console.log('Payment Successful!')
        res.status(200).send('Awesome! It worked!')
    },
    // nodemailer mailer object
    sendEmail: (req, res, next) => {
        console.log(req.body)
        const { user_email, message } = req.body;

        const mailOptions = {
            from: DEV_EMAIL,
            to: user_email,
            subject: 'Thank you from the Clone Once Team :)',
            text: message
        }

        transport.sendMail(mailOptions, (error, response) => {
            if(error) {
                console.log(error)
            } else {
                res.status(200).send(response)
            }
        })
    },
    sendText: (req, res, next) => {
        const { user_phone_number, message} = req.body
        client.messages.create({
            body: message,
            from: TWILIO_PHONE_NUMBER,
            to: user_phone_number
        }).then( message => {
            if(message.sid) {
                res.status(200).send('nice')
            }
        })
    },
    endSession: (req, res, next) => {
        req.session.destroy()
        res.status(200).send('Session destroyed! Bring on the next one.')
    }
}