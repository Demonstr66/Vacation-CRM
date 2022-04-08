const short = require("short-uuid");
import { defUser } from "../plugins/schema.js";

const dataMethods = {
  methods: {
    mixSaveData({ saveMethod, isNew, data }) {
      return this.$store.dispatch(saveMethod, data)
        .then(res => this.mixSuccess(isNew
          ? "Данные сохранены"
          : "Данные обновлены"))
        .catch((err) => this.mixError(err));
    },
    mixDeleteData({ delMethod, id }) {
      return this.$store.dispatch(delMethod, id)
        .then(res => this.mixSuccess("Данные удалены"))
        .catch((err) => this.mixError(err));
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
      this.$store.dispatch("setMessage", {
        type: "error",
        text: err.message,
        code: err.code,
      });
    }
  }
}

const taskMethods = {
  mixins: [dataMethods],
  methods: {
    mixSaveTask(isNew, data) {
      let saveMethod = "workspace/addTask";

      return this.mixSaveData({ saveMethod, data, isNew })
    },
    mixDeleteTask(id) {
      let delMethod = "workspace/db/removeTask";

      return this.mixDeleteData({ delMethod, id })
    }
  }
}

const teamMethods = {
  mixins: [dataMethods],
  methods: {
    mixSaveTeam(isNew, data) {
      let saveMethod = "workspace/addTeam";

      return this.mixSaveData({ saveMethod, data, isNew })
    },
    mixDeleteTeam(id) {
      let delMethod = "workspace/db/removeTeam";

      return this.mixDeleteData({ delMethod, id })
    }
  }
}

const postMethods = {
  mixins: [dataMethods],
  methods: {
    mixSavePost(isNew, data) {
      let saveMethod = "workspace/addPost";

      return this.mixSaveData({ saveMethod, data, isNew })
    },
    mixDeletePost(id) {
      let delMethod = "workspace/db/removePost";

      return this.mixDeleteData({ delMethod, id })
    }
  }
}

const saveUserData = {
  mixins: [dataMethods],
  methods: {
    mixSaveUserDataToDb(isNew, user) {
      let saveMethod = isNew ? "user/db/create" : "user/update";
      let workspace = this.$store.getters["workspace/id"];
      let uid = isNew ? short().new() : user.uid;
      let data = defUser(user, { uid, workspace });

      return this.mixSaveData({ saveMethod, data, isNew })
    }
  }
}
export { saveUserData, taskMethods, teamMethods, postMethods }

