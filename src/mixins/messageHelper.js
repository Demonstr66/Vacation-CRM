export const messageHelper = {
    methods: {
        mixMessage(msg) {
            console.log('msg msg')
            this.$store.dispatch("setMessage", msg);
        },
        mixSuccess(msg) {
            console.log('msg suc')
            this.$store.dispatch("setMessage", {
                type: "success",
                text: msg,
            });
        },
        mixError(err) {
            console.log('msg err')
            console.log(err)
            this.$store.dispatch("setMessage", {
                type: "error",
                text: err.code ? err.message : err,
                code: err.code,
            });
        }
    }
}