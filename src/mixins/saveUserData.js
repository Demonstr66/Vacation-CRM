const short = require("short-uuid");
import { defUser } from "../plugins/schema.js";

export const saveUserData = {
  methods: {
    saveUserDataToDb(isNew, data) {
      let saveMethod = isNew ? "currentUser/DB/create" : "currentUser/update";
      let workspace = this.$store.getters["workspace/id"];
      let uid = isNew ? short().new() : data.uid;
      let user = defUser(data, { uid, workspace });
      
      return this.mixSaveData(saveMethod, user)
        .then(this.mixMsg(isNew))
        .catch((err) => this.mixMsg(isNew, err));
    },
    mixSaveData(saveMethod, user) {
      return this.$store.dispatch(saveMethod, user);
    },
    mixMsg(isNew, err) {
      this.$store.dispatch("setMessage", {
        type: err ? "error" : "success",
        text: err ? err.message :
          isNew
            ? "Данные сохранены"
            : "Данные обновлены",
        code: err ? err.code : "",
      });
    }
  }
}
