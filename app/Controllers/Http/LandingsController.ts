import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasesController from './BasesController'
import Database from '@ioc:Adonis/Lucid/Database'

export default class LandingsController extends BasesController {
  public async index({request,view}: HttpContextContract) {
    const page = request.input('page', 1)
    const limit = 20
    const media = await Database.from('media')
      .join('users', 'media.user_id', '=', 'users.id')
      .select('media.*')
      .select('users.first_name')
      .select('users.last_name')
      .select('users.image')
      .orderBy('created_at', 'desc')
      .paginate(page, limit)
    // if (request.input('page',false)) {
    //   return media
    // } else {
      return this.view( view, 'home', {
        title: '',
        media
      })
    // }
  }
}
