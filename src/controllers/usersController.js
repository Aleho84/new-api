import logger from '../utils/logger.js'
import { usersDao } from '../daos/index.js'

export const login = (req, res) => {
  try {
    res.status(200).json({
      message: `User ${req.user.email} successfully logged in`,
      id: req.user._id,
      email: req.user.email,
      token: req.user.token
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const loginError = (req, res) => {
  try {
    const msg = req.session.messages
    req.session.messages = null
    res.status(401).json({ message: msg[0] })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const signin = (req, res) => {
  try {
    res.status(201).json({
      message: 'Registered user successfully',
      id: req.user._id,
      email: req.user.email,
      token: req.user.token
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }

}

export const signinError = (req, res) => {
  try {
    const msg = req.session.messages
    req.session.messages = null
    res.status(400).json({ message: msg[0] })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const logout = (req, res) => {
  try {
    if (!req.user) {
      const msg = `Can not closed anonymous session`
      logger.info(`[USERS]: ${msg}`)
      res.status(400).json({ message: msg })
      return
    }

    req.session.destroy((err) => {
      if (err) {
        const msg = 'Failed to log out'
        logger.warn(`[USERS]: ${msg}`)
        return res.status(500).json({ message: msg })
      }
      const msg = `Closed session ${req.user.email}`
      logger.info(`[USERS]: ${msg}`)
      res.status(200).json({ message: msg })
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const currentUser = (req, res) => {
  try {
    if (req.user) {
      const { name, lastname, image, email } = req.user
      res.status(200).json({ name, lastname, email, image })
    } else {
      res.status(200).json({ name: 'Anonymous' })
    }
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const userDeleted = await usersDao.delete(req.params.id)
    if (userDeleted) {
      const msg = 'User deleted successfully'
      logger.info(`[USERS]: ${msg}`)
      res.status(200).json({
        message: msg,
        user: userDeleted
      })
    } else {
      res.status(404).json({ message: `User not found. ID:${req.params.id}` })
    }
  } catch (err) {
    logger.error(err)
    res.status(500).json({ message: err.message })
  }
}