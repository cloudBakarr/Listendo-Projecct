import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasesController from './BasesController'
import RegisterValidator from 'App/Validators/RegisterValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import PasswordValidator from 'App/Validators/PasswordValidator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Event from '@ioc:Adonis/Core/Event'
import { string } from '@ioc:Adonis/Core/Helpers'
import Vars from '../../../template-variables'
import { timeAgo } from 'get-how-long-ago'

export default class LoginController extends BasesController {
  public showLogin(ctx: HttpContextContract) {
    return this.view( ctx.view, 'login', {
      title: 'Login',
    })
  }

  public async login({ request, auth, response, session }: HttpContextContract) {
    try {
      const payload: any = await request.validate(LoginValidator)
      await auth.use('web').attempt(payload.email, payload.password)
      session.flash('messages', [
        {
          text: 'Welcome back',
          type: 'info',
        },
      ])
      response.redirect().toRoute('DashboardController.index')
    } catch (errors) {
      this.handelError(session, response, errors)
    }
  }

  public async logout({
    auth,
    response,
  }: {
    auth: HttpContextContract['auth']
    response: HttpContextContract['response']
  }) {
    await auth.use('web').logout()
    response.redirect().toRoute('LoginController.showLogin')
  }

  public showRegister(ctx: HttpContextContract) {
    return this.view( ctx.view, 'register', {
      title: 'Register',
    })
  }

  public async register({ request, session, response, auth /*, view */ }: HttpContextContract) {
    var payload: any = null
    try {
      payload = await request.validate(RegisterValidator)
      let user = new User()
      user.firstName = payload.firstName
      user.lastName = payload.lastName
      user.email = payload.email
      user.password = await Hash.make(payload.password)
      user.email_verifid = true // for temporary
      user.verify_code = string.generateRandom(50)
      user.verify_code_date = Date.now() + 1000 * 60 * 10 + ''
      await user.save()
      await auth.use('web').login(user)
      session.flash('messages', [
        {
          text: `Hello and Welcome to ${Vars.appName} app!`,
          type: 'success',
        },
      ])
      Event.emit('email:verify', { User: user, Vars })
      response.redirect().toRoute('DashboardController.index')
      // return this.view( view, 'verification_sent', {
      //   title: 'Verify email',
      // })
    } catch (errors) {
      this.handelError(session, response, errors)
    }
  }

  public async verify({ params, session, auth, response, view, request }: HttpContextContract) {
    let reset_password: string = request.qs().reset_password
    let email = params.email
    let code: string = params.code
    const user = await User.findBy('email', email)
    if (user?.verify_code === code.trim() && parseInt(user.verify_code_date || '0') > Date.now()) {
      !reset_password &&
        session.flash('messages', [
          {
            text: `Your account has successfuly verified`,
            type: 'success',
          },
        ])
      reset_password && session.flash('password_reset', true)
      user.email_verifid = true
      user.verify_code = null
      await user.save()
      await auth.use('web').login(user)
      if (reset_password) {
        response.redirect().toRoute('LoginController.setNewPassword')
      } else {
        response.redirect().toRoute('DashboardController.index')
      }
    } else {
      if (reset_password) {
        session.flash('messages', [
          {
            text: 'Reset password request failed! (your link is invalid or expired)',
            type: 'danger',
          },
        ])
        response.redirect().toRoute('LoginController.showLogin')
      } else {
        return this.view( view, 'verify_fails', {
          title: 'Verification failed!',
        })
      }
    }
  }

  public async resend(
    { auth, session, response, request }: HttpContextContract,
    reset_password: boolean = false
  ) {
    let user: User | null | undefined = auth.user
    if (reset_password) {
      user = await User.findBy('email', request.input('email'))
    }
    if (user instanceof User) {
      let verify_code_date = parseInt(user.verify_code_date + '') || 0
      if (verify_code_date < Date.now()) {
        user.verify_code = string.generateRandom(50)
        user.verify_code_date = Date.now() + 1000 * 60 * 10 + ''
        await user.save()
        Event.emit(reset_password ? 'email:resendPassword' : 'email:verify', {
          User: user,
          Vars,
        })
        session.flash('messages', [
          {
            text: `A new verofication link has sent to your email!`,
            type: 'success',
          },
        ])
        response.redirect().back()
      } else {
        let until = 2 * Date.now() - verify_code_date
        session.flash('messages', [
          {
            text: `You can't request for ${
              reset_password ? 'reset password' : 'resend'
            } until ${timeAgo(until).string.replace('ago', '')}.`,
            type: 'warning',
          },
        ])
        return response
          .redirect()
          .toRoute(`LoginController.${reset_password ? 'forgetPassword' : 'notVerified'}`)
      }
    } else {
      if (reset_password) {
        session.flash('messages', [
          {
            text: 'No account found with this email!',
            type: 'warning',
          },
        ])
        response.redirect().back()
      } else {
        session.flash('messages', [
          {
            text: 'First log into your account!',
            type: 'warning',
          },
        ])
        this.logout({ auth, response })
      }
    }
  }

  public notVerified({ view }) {
    return this.view( view, 'not_verified', {
      title: 'Email Not Verified',
      type: 'warning',
    })
  }

  public forgetPassword({ view }: HttpContextContract) {
    return this.view( view, 'reset_password', {
      title: 'Forget Password',
    })
  }

  public async sendPasswordReset(ctx: HttpContextContract) {
    return this.resend(ctx, true)
  }

  public setNewPassword({ session, view, response }: HttpContextContract) {
    if (session.flashMessages.get('password_reset', false)) {
      session.reflash()
      return this.view( view, 'reset_password_change', {
        title: 'Choose new password',
      })
    } else {
      response.redirect().toRoute('LoginController.showLogin')
    }
  }

  public async changePasswors({ session, response, request, auth }: HttpContextContract) {
    if (session.flashMessages.get('password_reset', false)) {
      try {
        let payload: any = await request.validate(PasswordValidator)
        let user = auth.user

        if (user instanceof User) {
          user.password = await Hash.make(payload.password)
          await user.save()
          session.flash('messages', [
            {
              text: 'Your password successfuly set!',
              type: 'success',
            },
          ])
          response.redirect().toRoute('DashboardController.index')
        } else {
          throw new Error('User not found!')
        }
      } catch (errors) {
        session.reflash()
        return this.handelError(session, response, errors)
      }
    } else {
      response.redirect().toRoute('LoginController.showLogin')
    }
  }
}
