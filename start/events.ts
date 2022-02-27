/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import User from 'App/Models/User'
import Vars from '../template-variables'
import Application from '@ioc:Adonis/Core/Application'

interface UserVars {
  User: User;
  Vars: typeof Vars;
}

function log(_:any) {
  // console.log('________________________________________')
  // console.log("can't send email",e)
  // console.log('____ERROR_MESSAGE___')
  // console.log("can't send email",e.message)
  // console.log('________________________________________')
}

Event.on('email:verify', async ({ User, Vars }: UserVars) => {
  try {
    await Mail.send((message) => {
      message
        .from(Application.env.get('SMTP_USERNAME','Video Manager'))
        .to(User.email)
        .subject('Verify your account!')
        .htmlView('emails/verify_email', {
          User,
          ...Vars,
        })
    })
  } catch (e) {
    log(e)
  }
})

Event.on('email:resendPassword', async ({ User, Vars }: UserVars) => {
  try {
    await Mail.send((message) => {
      message
        .from(Application.env.get('SMTP_USERNAME','Video Manager'))
        .to(User.email)
        .subject('Reset password!')
        .htmlView('emails/reset_password', {
          User,
          ...Vars,
        })
    })
  } catch (e) {
    log(e)
  }
})
