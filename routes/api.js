const express = require('express')
const router = express.Router()
const apiController = require('./../controllers/api')
const cors = require('cors')

router.use(cors())
router.post('/api/ad/create', apiController.create)


module.exports = router