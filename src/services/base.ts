import { reactive } from 'vue'
import { Axios, AxiosResponse } from 'axios'

import { useApi } from '/@src/composable/useApi'
import APIExceptionCatchAll from '/@src/utils/decorators'


export interface DataMixin {
  id?: number | null
  [propName: string]: any
}

export abstract class ApiModel {
  id!: number
  data!: DataMixin | null
  state = reactive<DataMixin>({})
  fields: string[] = []

  constructor(fields: string[]) {
    this.fields = fields
  }

  public redefineFields() {
    this.fields.forEach((field: string) => {
      if (this.hasOwnProperty(field)) {
        // @ts-ignore
        delete this[field]
      }

      this.state[field] = null
      Object.defineProperty(this, field, {
        get: () => this.state[field],
        set: (value) => this.state[field] = value
      })
    })
  }

  public getData(): DataMixin {
    return this.state
  }

  public apiData(fields?: string[]): DataMixin {
    const apiFields = fields ? fields : this.fields
    // create object with only form fields without additional data
    return Object.keys(this.state).reduce((prev: object, currValue: string) => {
      if (apiFields.includes(currValue))
        return { ...prev, ...{ [currValue]: this.state[currValue] } }
      return prev
    }, {})
  }

  public parseData(data: AxiosResponse['data'] | object): ApiModel {
    this.id = data.id
    this.data = data
    for (const property in data) {
      this.state[property] = data[property]
    }
    return this
  }

  public copy(): ApiModel {
    // @ts-ignore
    const newInstance = new this.constructor(this.fields)
    newInstance.id = this.id
    newInstance.data = this.data
    for (const key in this.state) {
      newInstance.state[key] = this.state[key]
    }
    return newInstance
  }
}


@APIExceptionCatchAll
export class Service<Model extends ApiModel> {
  _api: Axios
  _apiRoute: string
  _model: new () => Model

  _routes: { [propName: string]: Function } = {
    concreate: (apiRoute: string, id: number, ...args: string[]) => `${apiRoute}/${id}/`,
    list: (apiRoute: string, ...args: string[]) => `${apiRoute}s/`,
    create: (apiRoute: string, instance: Model, ...args: string[]) => `${apiRoute}/`,
    update: (apiRoute: string, instance: Model, ...args: string[]) => `${apiRoute}/${instance.id}/`,
    upgrade: (apiRoute: string, instance: Model, ...args: string[]) => `${apiRoute}/${instance.id}/`,
    delete: (apiRoute: string, instance: Model, ...args: string[]) => `${apiRoute}/${instance.id}/`,
  }

  _configs: { [propName: string]: object } = {
    concreate: {},
    list: {},
    create: {},
    update: {},
    upgrade: {},
    delete: {}
  }

  constructor(path: string, model: new () => Model, api?: Axios) {
    if (this.constructor == Service)
      throw new Error("Abstract classes can't be instantiated.")

    if (api)
      this._api = api
    else
      this._api = useApi()
    this._apiRoute = path
    this._model = model
  }

  public parseData(data: AxiosResponse['data'] | object): Model {
    const instance = new this._model()
    instance.parseData(data)
    return instance
  }

  public async get(index: number | Model): Promise<Model> {
    if (typeof index === 'object' && !index.id) throw Error('Please, provide instance id')

    const { data } = await this._api.get(
      this._routes.concreate(
        this._apiRoute,
        typeof index === 'object' ? index.id : index
      ),
      this._configs.concreate
    )
    if (typeof index !== 'object') return this.parseData(data)
    index.parseData(data)
    return index
  }

  public async list(params: any = {}):
    Promise<{
      count: number,
      results: Model[],
      links: {
        next: string | null,
        previous: string | null
      }
    }> {
    const { data } = await this._api.get(
      this._routes.list(this._apiRoute),
      {
        ...this._configs.list,
        params: params
      }
    )
    return {
      count: data.count,
      results: data.results.map((item: any) => this.parseData(item)),
      links: data.links
    }
  }

  public async flatList(params: any = {}): Promise<Model[]> {
    const { results } = await this.list(params)
    return results
  }

  public async create(instance: Model): Promise<Model> {
    const { data } = await this._api.post(
      this._routes.create(this._apiRoute, instance),
      instance.apiData(),
      this._configs.create
    )
    instance.parseData(data)
    return instance
  }

  public async update(instance: Model): Promise<Model> {
    if (!instance.id) throw Error('Please, provide instance id')

    await this._api.put(
      this._routes.update(this._apiRoute, instance),
      instance.apiData(),
      this._configs.update
    )
    return await this.get(instance.id)
  }

  public async upgrade(instance: Model, fields?: string[]): Promise<Model> {
    if (!instance.id) throw Error('Please, provide instance id')

    const { data } = await this._api.patch(
      this._routes.upgrade(this._apiRoute, instance),
      instance.apiData(fields),
      this._configs.upgrade
    )
    instance.parseData(data)
    return instance
  }

  public async delete(instance: Model): Promise<void> {
    if (!instance.id) throw Error('Please, provide instance id')

    await this._api.delete(
      this._routes.delete(this._apiRoute, instance),
      this._configs.delete
    )
    return
  }

  public get api(): Axios {
    return this._api
  }

  public get apiRoute(): string {
    return this._apiRoute
  }

}