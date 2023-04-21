<template>
  <app-filters v-model="innerFilters" :hide-filters="['vacationStatus']">
    <template v-slot:header="{headerText}">
      <Can I="create" :on="$options.someUser">
        <div class="d-flex">
          <v-btn
              class="flex-grow-1"
              color="primary"
              outlined
              text
              @click="$emit('add')"
          >
            Добавить
          </v-btn>
          <icon-btn-with-tip
              btn-class="ml-2"
              btn-style="border-radius: 4px; border-color: rgba(0, 0, 0, 0.12);"
              color="primary"
              icon="mdi-arrow-bottom-left"
              outlined
              @click="$emit('import')"
          >
            Импорт
          </icon-btn-with-tip>

          <!--        <icon-btn-with-tip-->
          <!--          btn-class="ml-2"-->
          <!--          btn-style="border-radius: 4px; border-color: rgba(0, 0, 0, 0.12);"-->
          <!--          color="primary"-->
          <!--          icon="mdi-arrow-top-right"-->
          <!--          outlined-->
          <!--          @click="$emit('export')"-->
          <!--        >-->
          <!--          Экспорт-->
          <!--        </icon-btn-with-tip>-->
        </div>
        <v-btn
            v-if="!isAllActive"
            class="flex-grow-1 mt-2"
            color="primary"
            outlined
            text
            block
            @click="$emit('invite-all')"
            :loading="inviting"
        >
          Пригласить всех
        </v-btn>
      </Can>
    </template>
  </app-filters>

</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {posts, tasks, teams} from "@/mixins/ComputedData";
import AdministrationDragItems from "@/components/Administration/AdministrationDragItems";
import {User} from "@/plugins/servises/User";
import AppFilters from "@/components/UI/app-filters";

export default {
  name: 'AdministrationRightSidebar',
  someUser: new User(),
  components: {AppFilters, AdministrationDragItems, IconBtnWithTip},
  props: {
    filters: {},
    inviting: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    innerFilters: {},
  }),
  computed: {
    isAllActive() {
      const users = Object.values(this.$store.getters['users/get'])
      return !users.some(user => !user.active)
    }
  },
  watch: {
    innerFilters() {
      this.$emit('update:filters', this.innerFilters)
    }
  }
}
</script>
