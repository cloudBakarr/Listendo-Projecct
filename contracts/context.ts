declare module '@ioc:Adonis/Core/HttpContext' {
  interface HttpContextContract {
    appURL: (path:string) => string
  }
}
