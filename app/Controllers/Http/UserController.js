'use strict'

const User = use('App/Models/User')

class UserController {
  async store ({ request }) {
    const data = request.only(['username', 'email', 'password'])
    const user = await User.create(data)

    return user
  }

  async update ({ params, request, response }) {
    const user = User.findOrFail(params.id)
    const data = request.only(['username', 'email', 'password'])

    // Pode alterar nome e senha passando a nova senha e a confirmação da nova senha

    user.merge(data)
    await user.save()

    return user
  }
}

module.exports = UserController
