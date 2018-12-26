'use strict'

const Event = use('App/Models/Event')

class EventController {
  async index ({ request, response, view }) {}

  async store ({ request, response, auth }) {
    const data = request.only(['title', 'location', 'date'])
    const event = await Event.create({ ...data, user_id: auth.user.id })

    return event
  }

  async show ({ params, request, response, view }) {}

  async update ({ params, request, response }) {}

  async destroy ({ params, request, response }) {}
}

module.exports = EventController
