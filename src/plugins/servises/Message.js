import store from "@/store";

function IMessage(opt) {
  let msg = {
    text: '',
    code: null,
    type: 'info'
  }

  if (typeof opt === 'string') {
    msg.text = opt
  } else if (opt instanceof Error) {
    msg.text = opt.message
    msg.code = opt.code
    msg.type = opt.type
  } else if (opt instanceof Object) {
    msg.text = opt.message || opt.text
    msg.code = opt.code
    msg.type = opt.type
  }

  return msg
}

export class Message {
  static baseMessage(msg) {
    const data = IMessage(msg)
    store.dispatch("setMessage", data);
  }

  static successMessage(msg) {
    const data = IMessage(msg)
    data.type = 'success'
    this.baseMessage(data)
  }

  static errorMessage(msg) {
    const data = IMessage(msg)
    data.type = 'error'
    this.baseMessage(data)
  }
}