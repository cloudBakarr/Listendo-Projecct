import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', 'DashboardController.index')
  Route.get('/settings', 'DashboardController.showSettings')
  Route.post('/change_info', 'DashboardController.changeInfo')
  Route.post('/change_password', 'DashboardController.changePassword')
  Route.post('/add', 'DashboardController.addMedia')
  Route.get('/delete/:id', 'DashboardController.deleteMedia')
  Route.get('/edit/:id', 'DashboardController.showMusic')
  Route.post('/edit/:id', 'DashboardController.editMusic')
}).middleware(['auth', 'verified']).prefix('/dashboard')
