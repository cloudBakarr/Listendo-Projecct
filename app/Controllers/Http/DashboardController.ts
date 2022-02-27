import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BasesController from './BasesController'
import Application from '@ioc:Adonis/Core/Application'
import UserInfoValidator from 'App/Validators/UserInfoValidator'
import ChangePasswordValidator from 'App/Validators/ChangePasswordValidator'
import User from 'App/Models/User'
import {
  uploadToImages,
  getImageLink,
  removeImage,
  uploadToVideos,
  getVideoLink,
  removeVideo,
} from 'App/CloudStorage/gcs'
import { string } from '@ioc:Adonis/Core/Helpers'
import Hash from '@ioc:Adonis/Core/Hash'
import AddMediaValidator from 'App/Validators/AddMediaValidator'
import Media from 'App/Models/Media'
import Database from '@ioc:Adonis/Lucid/Database'
import EditMediaValidator from 'App/Validators/EditMediaValidator'

export default class DashboardController extends BasesController {
  public async index({ view, auth, request, session, response }: HttpContextContract) {
    try {
      let user = auth.user
      if (user instanceof User) {
        const page = request.input('page', 1)
        const limit = 10
        const media = await Database.from('media')
          .where('user_id', user.id)
          .orderBy('created_at', 'desc')
          .paginate(page, limit)
        return this.view(view, 'dashboard', {
          title: 'Dashboard',
          media,
        })
      } else {
        throw new Error('User not found!')
      }
    } catch (e) {
      this.handelError(session, response, e)
    }
  }

  public showSettings({ view, auth }: HttpContextContract) {
    return this.view(view, 'settings', {
      title: 'Profile Settings',
      user: auth.user,
    })
  }

  public async changePassword({ request, session, response, auth }: HttpContextContract) {
    try {
      let user = auth.user
      if (user instanceof User) {
        const payload: any = await request.validate(ChangePasswordValidator)
        if (await Hash.verify(user.password, payload.oldPassword)) {
          user.password = await Hash.make(payload.newPassword)
          await user.save()
          session.flash('messages', [
            {
              text: 'User password changed successfuly',
              type: 'success',
            },
          ])
          response.redirect().back()
        } else {
          throw new Error('Invalid password!')
        }
      } else {
        throw new Error('User not found!')
      }
    } catch (e) {
      this.handelError(session, response, e)
    }
  }

  public async changeInfo({ request, session, response, auth }: HttpContextContract) {
    try {
      let user = auth.user
      if (user instanceof User) {
        const payload: any = await request.validate(UserInfoValidator)
        if (payload.image) {
          await payload.image.move(Application.tmpPath('images'))
          let newFileName = string.generateRandom(50) + '.' + payload.image.extname
          await uploadToImages(
            Application.tmpPath(`images/${payload.image.clientName}`),
            newFileName
          )
          user.image && (await removeImage(user.image.substring(user.image.lastIndexOf('/') + 1)))
          user.image = getImageLink(newFileName)
        }
        user.firstName = payload.firstName
        user.lastName = payload.lastName
        await user.save()
        session.flash('messages', [
          {
            text: 'User profile successfuly updated',
            type: 'success',
          },
        ])
        response.redirect().back()
      } else {
        throw new Error('User not found!')
      }
    } catch (e) {
      this.handelError(session, response, e)
    }
  }

  public async addMedia({ auth, session, request, response }: HttpContextContract) {
    try {
      let user = auth.user
      if (user instanceof User) {
        const payload: any = await request.validate(AddMediaValidator)
        var media = new Media()
        await payload.media.move(Application.tmpPath('videos'))
        let newFileName = string.generateRandom(50) + '.' + payload.media.extname
        await uploadToVideos(Application.tmpPath(`videos/${payload.media.clientName}`), newFileName)
        media.user_id = user.id + ''
        media.name = payload.name
        media.singer = payload.singer
        media.link = getVideoLink(newFileName)
        media.type = 'music'
        await media.save()
        session.flash('messages', [
          {
            text: 'Music added successfully!',
            type: 'success',
          },
        ])
        response.redirect().back()
      } else {
        throw new Error('User not found!')
      }
    } catch (e) {
      this.handelError(session, response, e)
    }
  }

  public async deleteMedia(ctx: HttpContextContract) {
    return this.musicValidator(ctx, async ({ session, response }, media) => {
      await removeVideo(media.link.substring(media.link.lastIndexOf('/') + 1))
      await media.delete()
      session.flash('messages', [
        {
          text: 'Music deleted successfully!',
          type: 'info',
        },
      ])
      response.redirect().back()
    })
  }

  private async musicValidator(
    ctx: HttpContextContract,
    fun: (ctx: HttpContextContract, media: Media) => void | any
  ) {
    try {
      let user = ctx.auth.user
      var media = await Media.find(ctx.params.id)
      if (!(user instanceof User)) {
        throw new Error('User not found!')
      } else if (!media) {
        throw new Error('Music not found!')
      } else if (user.id !== parseInt(media.user_id)) {
        throw new Error('Music is not yours')
      } else {
        return await fun(ctx, media)
      }
    } catch (e) {
      this.handelError(ctx.session, ctx.response, e)
    }
  }

  public async showMusic(ctx: HttpContextContract) {
    return this.musicValidator(ctx, ({ view }, media) => {
      return this.view(view, 'edit_video', {
        title: 'Edit music',
        media,
      })
    })
  }

  public async editMusic(ctx: HttpContextContract) {
    return this.musicValidator(ctx, async ({ request, session, response }, media) => {
      const payload: any = await request.validate(EditMediaValidator)
      media.name = payload.name
      media.singer = payload.singer
      await media.save()
      session.flash('messages', [
        {
          text: 'Music edited successfully!',
          type: 'success',
        },
      ])
      response.redirect().back()
    })
  }
}
