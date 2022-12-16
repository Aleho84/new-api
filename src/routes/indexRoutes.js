import { Router } from 'express'

const indexRouter = Router()

import {
    getIndexPage
} from '../controllers/indexController.js'

indexRouter.get('/', getIndexPage)

export default indexRouter