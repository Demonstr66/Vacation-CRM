function IMessage(opt) {
    let msg = {
        text: '',
        code: null,
        type: 'info'
    }

    if (typeof opt === 'string') {
        console.log('is String', opt)
        msg.text = opt
    }
    else if (opt instanceof Error) {
        console.log('is Error', opt)
        msg.text = opt.message
        msg.code = opt.code
        msg.type = opt.type
    }
    else if(opt instanceof Object) {
        console.log('is Object', opt)
        msg.text = opt.message || opt.text
        msg.code = opt.code
        msg.type = opt.type
    }

    return msg
}

export const messageHelper = {
    methods: {
        mixMessage() {},
        mixSuccess() {},
        mixError() {},
        baseMessage(msg) {
            console.log('baseMessage', msg)
            const data = IMessage(msg)
            this.$store.dispatch("setMessage", data);
        },
        successMessage(msg) {
            console.log('successMessage', msg)
            const data = IMessage(msg)
            data.type = 'success'
            this.baseMessage(data)
        },
        errorMessage(msg) {
            console.log('errorMessage', msg)
            const data = IMessage(msg)
            data.type = 'error'
            this.baseMessage(data)
        }
    }
}