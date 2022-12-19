import { Router } from 'express'
import passport from 'passport'
import { auth } from '../config/jsonwebtoken.js'

const userRouter = Router()

import {
    login,
    loginError,
    signin,
    signinError,
    logout,
    currentUser,
    deleteUser
} from '../controllers/usersController.js'

userRouter.get('/loginError', loginError)
userRouter.get('/signinError', signinError)
userRouter.get('/logout', logout)
userRouter.get('/currentUser', currentUser)

userRouter.post('/login', passport.authenticate('login', { failureRedirect: '/api/users/loginError', failureMessage: true }), login)
userRouter.post('/signin', passport.authenticate('signin', { failureRedirect: '/api/users/signinError', failureMessage: true }), signin)

userRouter.delete('/delete/:id', auth, deleteUser)

export default userRouter