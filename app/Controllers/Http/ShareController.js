'use strict'

const User = use('App/Models/User')
const Event = use('App/Models/Event')
const Mail = use('Mail')

class ShareController {
  async store ({ request, response, auth }) {
    try {
      const receiverEmail = request.input('receiver_email')
      const user = await User.findOrFail(auth.user.id)
      const event = await Event.findOrFail(request.input('event_id'))

      await Mail.send(
        ['emails.share_event'],
        {
          user,
          event
        },
        message => {
          message
            .to(receiverEmail)
            .from('dev@matheusmondenez.com', 'Matheus Mondenez')
            .subject('Um novo evento do seu interesse')
        }
      )
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'Ops! Tente novamente mais tarde' } })
    }
  }
}

module.exports = ShareController
