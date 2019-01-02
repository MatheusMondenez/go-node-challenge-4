'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index ({ request, response, view, auth }) {
    const { date, page } = request.get()
    const events = await Event.query()
      .where('user_id', auth.user.id)
      // .andWhere('DATE_FORMAT(date, "%Y-%m-%d")', date)
      .with('user')
      .paginate(page)

    return events
  }

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])
    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  async show ({ params }) {
    const event = await Event.findOrFail(params.id)

    await event.load('user')

    return event
  }

  async update ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    const data = request.only(['title', 'location', 'date'])

    if (moment(event.date).isBefore()) {
      return response.status(500).send({
        error: {
          message: 'Este evento não pode ser alterado, pois já passou'
        }
      })
    }

    event.merge(data)
    await event.save()

    return event
  }

  async destroy ({ params, request, response }) {
    const event = await Event.findOrFail(params.id)
    
    if (moment(event.date).isBefore()) {
      return response.status(500).send({
        error: {
          message: 'Este evento não pode ser removido, pois já passou'
        }
      })
    }

    await event.delete()
  }
}

module.exports = EventController
