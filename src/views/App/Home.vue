<template>
  <div>
    <v-btn @click="test">test</v-btn>
    <v-btn @click="get">get</v-btn>
    <v-btn @click="update">update</v-btn>
  </div>
</template>


<script>
import MainTools from "@/components/user/tools/main";
import {messageHelper} from "@/mixins/MessageMethods";
import {schedules, user} from "@/mixins/ComputedData";
import abilityFor from "@/plugins/defineAbilities";
import {Vacation} from "@/plugins/Vacation";

export default {
  components: {MainTools},
  mixins: [messageHelper, user, schedules],
  data: () => ({
    vacations: null
  }),
  methods: {
    test() {
      console.log(this.vacations)
    },
    async get() {
      let vacations = this.$store.getters['vacations/get']

      this.vacations = vacations
    },
    update() {
    }
  },
};
</script>