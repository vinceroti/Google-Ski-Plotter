'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
require('dotenv').config()

module.exports = {
  NODE_ENV: '"production"',
  MAP_KEY: JSON.stringify(process.env.MAPS),
  SERVER: '"/"',
}
