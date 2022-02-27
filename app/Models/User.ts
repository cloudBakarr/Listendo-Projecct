import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Media from "App/Models/Media";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public googleObject: object

  @column()
  public facebookObject: object

  @column()
  public loginToken: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public image: string | null

  @column()
  public email_verifid: boolean

  @column()
  public verify_code: string|null

  @column()
  public verify_code_date: string|null

  @hasMany(() => Media)
  public media: HasMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
