<template>
  <div>
    <app-base-sheet>
      Добро пожаловать!
    </app-base-sheet>
<!--    <app-base-sheet>-->
<!--      <div>HEADER</div>-->
<!--    </app-base-sheet>-->
<!--    <app-block-with-right-navbar>-->

<!--&lt;!&ndash;      <template #main>&ndash;&gt;-->
<!--&lt;!&ndash;        <app-base-sheet>&ndash;&gt;-->
<!--&lt;!&ndash;          <div>MAIN</div>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-text-field v-model.trim="email" label="Email"></v-text-field>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-text-field v-model.trim="pass" label="Pass"></v-text-field>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-text-field v-model.trim="uid" label="Uid"></v-text-field>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-btn @click="create">&ndash;&gt;-->
<!--&lt;!&ndash;            create&ndash;&gt;-->
<!--&lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-btn @click="invite">&ndash;&gt;-->
<!--&lt;!&ndash;            invite&ndash;&gt;-->
<!--&lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-btn @click="del">&ndash;&gt;-->
<!--&lt;!&ndash;            delete&ndash;&gt;-->
<!--&lt;!&ndash;          </v-btn>&ndash;&gt;-->
<!--&lt;!&ndash;        </app-base-sheet>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--&lt;!&ndash;      <template #navbar>&ndash;&gt;-->
<!--&lt;!&ndash;        <app-base-sheet>&ndash;&gt;-->
<!--&lt;!&ndash;          <div>NAVBAR</div>&ndash;&gt;-->
<!--&lt;!&ndash;          <div>&ndash;&gt;-->
<!--&lt;!&ndash;            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta eos natus porro&ndash;&gt;-->
<!--&lt;!&ndash;            quibusdam repellat sit tempore voluptates? Aperiam consequuntur dignissimos ea,&ndash;&gt;-->
<!--&lt;!&ndash;            excepturi explicabo inventore laborum minima neque non nostrum voluptates.&ndash;&gt;-->
<!--&lt;!&ndash;          </div>&ndash;&gt;-->
<!--&lt;!&ndash;        </app-base-sheet>&ndash;&gt;-->
<!--&lt;!&ndash;      </template>&ndash;&gt;-->
<!--    </app-block-with-right-navbar>-->
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