import {Base} from "@/plugins/servises/Base";
import {dataToGenerateFile} from "@/plugins/schema";
import store from "@/store";
import {Roles} from "@/plugins/servises/Roles";

const moment = require('moment')

export class Workspace extends Base {
  static schema = {
    id: '',
    title: '',
    domain: '',
    owner: '',

    permissions: Roles.defaultPermissions,
    setting: {},
    tasks: [],
    posts: [],
    teams: [],
    templateFile: {
      exist: false,
      modified: '-1'
    }
  }

  constructor(args) {
    super({
      save: 'workspace/update',
      delete: 'workspace/delete',
      create: 'workspace/create',
    })

    Object.assign(this, Workspace.schema, args)
  }

  static updateTemplateFileInfo(exist = false) {
    let ws = store.getters["workspace/get"]

    ws.update({
      templateFile: {
        exist,
        modified: Date.now()
      }
    }, '', true)
  }

  static normalize(...args) {
    return Base.normalize(Workspace.schema, args);
  }

  create() {
    return super.create(this);
  }

  update(newData, message = 'Данные файла обновлены', silent = false) {
    let data = Workspace.normalize(this)
    if (newData !== undefined) {
      Object.assign(data, newData)
    }
    return super.update(data, {}, message, silent)
  }

  delete() {
    return super.delete()
  }

}