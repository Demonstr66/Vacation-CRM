export const messageHelper = {
    methods: {
        mixSuccess(msg) {
            console.log('msg suc')
            this.$store.dispatch("setMessage", {
                type: "success",
                text: msg,
            });
        },
        mixError(err) {
            console.log('msg err')
            this.$store.dispatch("setMessage", {
                type: "error",
                text: err.message,
                code: err.code,
            });
        }
    }
}