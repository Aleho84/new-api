import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { usersDao } from '../daos/index.js'
import { encryptPassword, comparePassword } from '../utils/bcrypt.js'
import logger from '../utils/logger.js'
import { tokenGenerate } from './jsonwebtoken.js'

const passCheck = (password) => {
    const min = 6
    if (password.length < 6) { return false }
    return true
}

passport.use('signin', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        let msg = null

        if (!req.body.name) {
            msg = `Signin fail, the name is missing`
        } else if (!(passCheck(req.body.password))) {
            msg = `Signin fail, the password must be at least 6 characters`
        } else if (!req.body.image) {
            msg = `Signin fail, the image is missing`
        }

        if (msg) {
            logger.warn(`[USERS]: ${msg}`)
            return done(null, false, { message: msg })
        }

        const user = await usersDao.findByEmail(email)
        if (user) { 
            msg = `Signin fail, ${email} already exists` 
            logger.warn(`[USERS]: ${msg}`)
            return done(null, false, { message: msg })
        }

        const nuevoUsuario = await usersDao.create(req.body)
        nuevoUsuario.token = tokenGenerate(nuevoUsuario)
        req.body.password = await encryptPassword(password)

        msg = `User ${email} signin susscefuly`
        logger.info(`[USERS]: ${msg}`)

        return done(null, nuevoUsuario)
    }
))

passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async (req, email, password, done) => {
        try {
            const user = await usersDao.findByEmail(email)
            if (!user) {
                const msg = `Login fail, user ${email} don't exist`
                logger.warn(`[USERS]: ${msg}`)
                return done(null, false, { message: msg })
            }
            const isTruePassword = await comparePassword(password, user.password)
            if (!isTruePassword) {
                const msg = `Login fail, wrong password for user ${email}`
                logger.warn(`[USERS]: ${msg}`)
                return done(null, false, { message: msg })
            }
    
            user.token = tokenGenerate(user)
    
            const msg = `User ${email} login susscefuly`
            logger.info(`[USERS]: ${msg}`)
    
            return done(null, user)            
        } catch (error) {
            return done(error)
        }
    }
))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {
    const user = await usersDao.get(id)
    if (user) {
        const { name, lastname, image, email } = user

        done(null, {
            name,
            lastname,
            image,
            email
        })
    }
})