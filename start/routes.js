'use strict'

const Route = use('Route')

Route.post('users', 'UserController.store').validator('User/Post')

Route.post('sessions', 'SessionController.store')

Route.post('passwords', 'ForgotPasswordController.store')
Route.put('passwords', 'ForgotPasswordController.update')

Route.group(() => {
  Route.resource('events', 'EventController').apiOnly()
  // .validator(new Map([[['projects.store'], ['Project']]]))
  Route.post('share', 'ShareController.store')
  Route.put('users/:id', 'UserController.update').validator('User/Put')
}).middleware(['auth'])
