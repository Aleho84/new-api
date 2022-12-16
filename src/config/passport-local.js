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
            msg = `[USERS]: Signin fail, the name is missing`
        } else if (!req.body.email) {
            msg = `[USERS]: Signin fail, the email is missing`
        } else if (!req.body.password) {
            msg = `[USERS]: Signin fail, the password is missing`
        } else if (!(passCheck(req.body.password))) {
            msg = `[USERS]: Signin fail, the password must be at least 6 characters`
        } else if (!req.body.image) {
            msg = `[USERS]: Signin fail, the image is missing`
        }

        if (msg) {
            logger.warn(msg)
            return done(null, false, { message: msg })
        }

        const user = await usersDao.findByEmail(email)
        if (user) { 
            msg = `[USERS]: Signin fail, ${email} already exists` 
            logger.warn(msg)
            return done(null, false, { message: msg })
        }

        const nuevoUsuario = await usersDao.create(req.body)
        nuevoUsuario.token = tokenGenerate(nuevoUsuario)
        req.body.password = await encryptPassword(password)

        msg = `[USERS]: User ${email} signin susscefuly`
        logger.info(msg)

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
        const user = await usersDao.findByEmail(email)
        if (!user) {
            const msg = `[USERS]: Login fail, user ${email} don't exist`
            logger.warn(msg)
            return done(null, false, { message: msg })
        }
        const isTruePassword = await comparePassword(password, user.password)
        if (!isTruePassword) {
            const msg = `[USERS]: Login fail, wrong password for user ${email}`
            logger.warn(msg)
            return done(null, false, { message: msg })
        }

        user.token = tokenGenerate(user)

        const msg = `[USERS]: User ${email} login susscefuly`
        logger.info(msg)

        return done(null, user)
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