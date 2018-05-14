'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
require('dotenv').config()

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  MAP_KEY: JSON.stringify(process.env.MAPS),
  SERVER: '"http://localhost:8081"'
})
