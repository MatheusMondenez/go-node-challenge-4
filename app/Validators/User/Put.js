'use strict'

class Put {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      username: 'unique:users',
      password: 'required',
      new_password: 'confirmed'
    }
  }
}

module.exports = Put
