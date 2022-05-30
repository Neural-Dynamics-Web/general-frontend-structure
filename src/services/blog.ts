import { Service, ApiModel } from './base'
import APIExceptionCatchAll from '/@src/utils/decorators'


export class ArticleModel extends ApiModel {
  constructor() {
    const fields: Array<string> = [
      'title',
      'text',
      'created_at'
    ]
    super(fields)
    this.redefineFields()
  }
}

@APIExceptionCatchAll
export class BlogService extends Service<ArticleModel> {
  constructor() {
    // requests will use route /api/blog/
    super('blog', ArticleModel)

    // you should change 
    this._routes.list = (
      apiRoute: string, instance: ArticleModel, ...args: string[]
    ) => `${apiRoute}/articles/`

    // requests paths
    // concreate GET /api/blog
    // list GET /api/blog/articles/
    // create POST /api/blog/
    // update PUT /api/blog/
    // upgrade PATCH /api/blog/
    // delete DELETE /api/blog/
  }
}