import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasesController from 'App/Controllers/Http/BasesController'

export default class CheckEmailVerification extends BasesController {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    if (
      ctx.auth &&
      ctx.auth.user &&
      ctx.auth.user.email_verifid
    ) {
      await next()
    } else {
      ctx.response.redirect().toRoute('LoginController.notVerified')
    }
  }
}
