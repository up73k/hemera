'use strict'

const Hemera = require('./../../packages/hemera')
const HemeraBlipp = require('./../../packages/hemera-blipp')
const nats = require('nats').connect()

const hemera = new Hemera(nats, {
  logLevel: 'error'
})

hemera.use(HemeraBlipp)
hemera.ready(err => {
  if (err) {
    console.error(err)
    return
  }
  hemera.add(
    {
      topic: 'math',
      cmd: 'add'
    },
    (req, cb) => {
      cb(null, req.a + req.b)
    }
  )

  hemera.add(
    {
      topic: 'notify',
      pubsub$: true
    },
    req => {}
  )

  hemera.add('topic:math,cmd:sub', (req, cb) => {
    cb(null, req.a - req.b)
  })

  hemera.blipp()
})
