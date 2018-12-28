'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index ({ request, response, view, auth }) {
    const { page } = request.get()
    const events = await Event.query()
      .where('user_id', auth.user.id)
      .with('user')
      .paginate(page)

    return events
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])
    const event = await Event.create({ ...data, user_id: auth.user.id })
    const { date } = request.get()

    return event
  }

  async show ({ params, request, response, view }) {
    const event = await Event.findOrFail(params.id)

    await event.load('user')

    return event
  }

  async update ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'date'])
    // const date = moment(data.date)

    // if (date.isBefore()) {
    //   return response.status(5000).send({
    //     error: {
    //       message: 'Este evento não pode ser alterado, pois já passou'
    //     }
    //   })
    // }

    event.merge(data)
    await event.save()

    return event
  }

  async destroy ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    // const date = moment(data.date)

    // if (date.isBefore()) {
    //   return response.status(5000).send({
    //     error: {
    //       message: 'Este evento não pode ser apagado, pois já passou'
    //     }
    //   })
    // }

    await event.delete()
  }
}

module.exports = EventController
