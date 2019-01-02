'use strict'

const Model = use('Model')
const moment = require('moment')

class Event extends Model {
  getDate (date) {
    return moment(date).format('YYYY-MM-DD H:mm:ss')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Event
