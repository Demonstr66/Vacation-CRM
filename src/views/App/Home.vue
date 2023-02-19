<template>
  <div>
    <app-base-sheet>
      Добро пожаловать!
    </app-base-sheet>
  </div>
</template>


<script>
import MainTools from "@/components/user/tools/main";
import {schedules, teams, user} from "@/mixins/ComputedData";
import AppBlockWithRightNavbar from "@/components/AppBlockWithRightNavbar";
import AppBaseSheet from "@/layouts/AppBaseSheet";
import {User} from "@/plugins/servises/User";
import WorkspaceSetting from "@/components/workspace/Setting";
import AppPrivacyForm from "@/components/workspace/AppPrivacyForm";
import {api} from "@/plugins/api";

export default {
  components: {AppPrivacyForm, WorkspaceSetting, AppBaseSheet, AppBlockWithRightNavbar, MainTools},
  mixins: [user, schedules, teams],
  data: () => ({
    team: null,
    email: "",
    pass: "",
    uid: ""
  }),
  computed: {
    testUser() {
      return new User({team: this.team})
    }
  },
  methods: {
    create() {
      api.user.create(this.email, this.pass)
    },
    del() {
      api.user.delete(this.uid)
    },
    invite() {
      api.user.invite(this.email)
    }
  },
};
</script>