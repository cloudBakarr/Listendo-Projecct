import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import View from '@ioc:Adonis/Core/View'
import { timeAgo } from 'get-how-long-ago'

export default class BaseUrl {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    await ctx.auth.use('web').check()
    function appURL(path: string): string {
      let baseURL = ctx.request.protocol() + '://' + ctx.request.host()
      if (path.startsWith('/')) {
        return baseURL + path
      } else {
        return baseURL + '/' + path
      }
    }
    ctx.appURL = appURL
    View.global('appURL', appURL)
    View.global('timeAgo',timeAgo)
    await next()
  }
}
