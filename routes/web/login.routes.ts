import Route from '@ioc:Adonis/Core/Route'

// Route.get  ('/not_verified',            'LoginController.notVerified')
Route.get  ('/login',                   'LoginController.showLogin')
Route.post ('/login',                   'LoginController.login')
Route.post ('/logout',                  'LoginController.logout')
// Route.get  ('/forget_password',         'LoginController.forgetPassword')
// Route.post ('/forget_password',         'LoginController.sendPasswordReset')
Route.get  ('/register',                'LoginController.showRegister')
Route.post ('/register',                'LoginController.register')
// Route.get  ('/verify/:email/:code',     'LoginController.verify')
// Route.get  ('/send_verification_email', 'LoginController.resend').middleware('auth')
Route.get  ('/set_new_password',        'LoginController.setNewPassword')
Route.post ('/set_new_password',        'LoginController.changePasswors')
