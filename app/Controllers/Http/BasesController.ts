import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Vars from '../../../template-variables'

export default class BasesController {
  public async view(
    view: HttpContextContract['view'],
    viewName: string,
    localVars: object = {}
  ) {
    return view.render(viewName, {
      ...Vars,
      ...localVars,
    })
  }

  protected handelError (
    session: HttpContextContract['session'],
    response: HttpContextContract['response'],
    errors: { code: string; message: string; messages: null | [] }
  ) {
    if (errors.code === 'E_INVALID_AUTH_UID' || errors.code === 'E_INVALID_AUTH_PASSWORD') {
      errors.message = 'Your credentials does not match our records!'
    }
    session.flash('errors', errors.messages || errors.message)
    session.flashAll()
    response.redirect().back()
  }
}
