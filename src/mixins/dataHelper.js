import {messageHelper} from "@/mixins/messageHelper";

export const dataMethods = {
    mixins:[messageHelper],
    methods: {
        mixSaveData({saveMethod, isNew, data }) {
            console.log('mixSaveData')
            return this.$store.dispatch(saveMethod, data)
                .then(() => this.mixSuccess(isNew
                    ? "Данные сохранены"
                    : "Данные обновлены"))
                .catch((err) => this.mixError(err));
        },
        mixDeleteData({delMethod, id, msg = "Данные удалены"}) {
            console.log('mixDeleteData')
            return this.$store.dispatch(delMethod, id)
                .then(() => this.mixSuccess(msg))
                .catch((err) => this.mixError(err));
        },
    }
}

export const getUserNameById = {
    methods: {
        getUserNameById(uid) {
            const user = this.$store.getters['workspace/getUserById'](uid)
            return user ? user.fullName ? user.fullName : '' : ''
        }
    }
}