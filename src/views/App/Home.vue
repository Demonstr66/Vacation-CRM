<template>
  <div>
    <app-base-sheet>
      <div>HEADER</div>
    </app-base-sheet>
    <app-block-with-right-navbar>

      <template #main>
        <app-base-sheet>
          <div>MAIN</div>
          <v-text-field v-model.trim="email" label="Email"></v-text-field>
          <v-text-field v-model.trim="pass" label="Pass"></v-text-field>
          <v-text-field v-model.trim="uid" label="Uid"></v-text-field>
          <v-btn @click="create">
            create
          </v-btn>
          <v-btn @click="invite">
            invite
          </v-btn>
          <v-btn @click="del">
            delete
          </v-btn>
        </app-base-sheet>
      </template>
      <template #navbar>
        <app-base-sheet>
          <div>NAVBAR</div>
          <div>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos natus porro
            quibusdam repellat sit tempore voluptates? Aperiam consequuntur dignissimos ea,
            excepturi explicabo inventore laborum minima neque non nostrum voluptates.
          </div>
        </app-base-sheet>
      </template>
    </app-block-with-right-navbar>
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