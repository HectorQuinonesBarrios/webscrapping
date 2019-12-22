const next = require('next')
const express = require('express')
const bodyParser = require('body-parser')

const app = next({ dev: true })
const handle = app.getRequestHandler()
const port = process.env.port || 3030
app.prepare().then(() => {
  const server = express()
  server.use(bodyParser.json({limit: '10mb'}))
  server.use(bodyParser.urlencoded({ extended: true, limit: '10mb'}))

  server.use(require('./routes/api'))

  server.get('*', (req,res) => {
    return handle(req,res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`Listo http://localhost:${port}`)
  })
})
