<template>
  <div>
    <app-base-sheet>
      <div>HEADER</div>
    </app-base-sheet>
    <app-block-with-right-navbar>

      <template #main>
        <app-base-sheet>
          <div>MAIN</div>
          <v-select
            :items="Object.values(teams)"
            v-model="team"
            item-text="title"
            item-value="id"
          />
          <Can I="create" :on="testUser">
            <div>Создание Человека</div>
          </Can>
          <Can I="read" :on="testUser">
            <div>Чтение Человека</div>
          </Can>
          <Can I="update" :on="testUser">
            <div>Редактирование Человека</div>
          </Can>
          <Can I="delete" :on="testUser">
            <div>Удаление Человека</div>
          </Can>
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
import {Roles} from "@/plugins/servises/Roles";
import {User} from "@/plugins/servises/User";
import WorkspaceSetting from "@/components/workspace/Setting";
import AppPrivacyForm from "@/components/workspace/AppPrivacyForm";

export default {
  components: {AppPrivacyForm, WorkspaceSetting, AppBaseSheet, AppBlockWithRightNavbar, MainTools},
  mixins: [user, schedules, teams],
  data: () => ({
    team: null,
  }),
  computed: {
    testUser() {
      return new User({team: this.team})
    }
  },
  methods: {
    test() {
      console.log(this.$can('update', this.testUser))
    }
  },
};
</script>