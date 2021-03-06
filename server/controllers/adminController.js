const bcrypt = require('bcryptjs')
var session_id_count = 1

module.exports = {
    register: (req, res, next) => {
        const { username, pinput } = req.body
        const db = req.app.get('db')
        db.check_username([username]).then(user => {

            if (user.length !== 0) {
                // console.log('Please choose a different username.')
                res.status(200).send('Username taken. Please try another.')


            } else {
                const salt = bcrypt.genSaltSync(10)
                const hash = bcrypt.hashSync(pinput, salt)
            
                db.register_admin([username, hash]).then( user => {
                    req.session.user.session_id = session_id_count
                    session_id_count++
                    req.session.user.user_id = user[0].user_id
                    req.session.user.username = user[0].username
                    // console.log(req.session)
                    res.status(200).send('Registration Successful')
                }).catch(500)
            }
        }).catch(500)
    },
    login: (req, res, next) => {
        const { username, pinput } = req.body
        const db = req.app.get('db')
        db.check_username([ username ]).then( user => {           
            // console.log('user: ', user[0].is_admin, user[0], 'req.session: ', req.session.user)
            if ( user.length !== 0 && user[0].is_admin === true ) {
                const validPassword = bcrypt.compareSync( pinput, user[0].password )
                // console.log(password)
                if ( validPassword === true ) {
                    // if ( (req.session.user.session_id) === typeof Number) {
                    //     req.session.user.session_id = session_id_count
                    //     session_id_count++
                    // }
                    req.session.user.user_id = user[0].user_id
                    req.session.user.username = user[0].user_name  
                    // console.log(req.session.user)
                    res.status(200).send()
                    // console.log(req.session)
                } else {
                    res.status(401).send('Wrong Password')
                    // res.status(500).send('Invalid Password')
                }
            } else {
                res.status(404).send('you must not be an admin... sneaky sneaky.')
                
            }
        }).catch( err => res.status(500).send('You must create credentials, and have a current Admin give you permissions.'))
    },
    validate: (req, res, next) => {
        const db = req.app.get('db')
        // console.log(req.session.user.username)
        if(req.session.user.username) {
        db.authorize([req.session.user.user_id]).then( isAdmin => {
            // console.log(isAdmin[0].is_admin)
            if(isAdmin[0].is_admin === true) {
                res.status(200).send('stay')
            }
        }).catch() 
    } else { 
        res.status(200).send('go home')
    }
      
    },
    logout: (req, res, next) => {
        req.session.destroy()
        res.status(200).send()
        // console.log(req.session)
    },
    adminSold: (req, res, next) => {
        const db = req.app.get('db')
        db.sold([ +req.body.id, req.body.value ]).then( list => {
            res.status(200).send(list.data)
        }).catch()
    }
}