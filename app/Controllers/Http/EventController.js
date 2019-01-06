'use strict'

const Event = use('App/Models/Event')
const moment = require('moment')

class EventController {
  async index ({ request, auth }) {
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
    const duplicatedDate = await Event.query()
      .where('user_id', auth.user.id)
      .andWhere('date', data.date)
      .first()

    if (moment(duplicatedDate.date).format('Y-MM-D H:mm:ss') === data.date) {
      return response.status(500).send({
        error: {
          message: 'Já existe um evento nesta data e horário'
        }
      })
    }

    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  async show ({ params, auth }) {
    const event = await Event.query()
      .where('user_id', auth.user.id)
      .andWhere('id', params.id)
      .with('user')
      .first()

    return event
  }

  async update ({ params, request, response, auth }) {
    const event = await Event.query()
      .where('user_id', auth.user.id)
      .andWhere('id', params.id)
      .first()
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

  async destroy ({ params, response }) {
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
