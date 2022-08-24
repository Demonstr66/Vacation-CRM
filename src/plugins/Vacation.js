import {defVacation} from "@/plugins/schema";

class Base {
  toString() {
    return JSON.stringify(this)
  }
}

export class Vacation extends Base {
  constructor(args) {
    super()
    Object.assign(this, defVacation(args))
  }

  sendToApprove() {
    this.status = 11
  }

  static statuses = {
    0: 'temp',
    1: 'send',
    2: 'approved',
    99: 'reject'
  }
}