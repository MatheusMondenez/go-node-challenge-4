'use strict'

const User = use('App/Models/User')
const Hash = use('Hash')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)

    return user
  }

  async update ({ params, request, response }) {
    const user = await User.findOrFail(params.id)
    const data = request.only(['username', 'password', 'new_password'])
    const passwordCheck = await Hash.verify(data.password, user.password)

    if (!passwordCheck) {
      return response.status(500).send({
        error: {
          message: 'Invalid password'
        }
      })
    }

    if (data.username) {
      user.username = data.username
    }

    if (data.new_password) {
      user.password = data.new_password
    }

    await user.save()

    return user
  }
}

module.exports = UserController
