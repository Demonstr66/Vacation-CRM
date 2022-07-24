<template>
  <div>
    <v-btn @click="test">Success</v-btn>
    <v-btn @click="tryy">try</v-btn>
  </div>
</template>


<script>
import MainTools from "@/components/user/tools/main";
import {messageHelper} from "@/mixins/MessageMethods";
import {user} from "@/mixins/ComputedData";
import abilityFor from "@/plugins/defineAbilities";

export default {
  components: {MainTools},
  mixins: [messageHelper, user],
  data: () => ({}),
  methods: {
    test() {
    },
    tryy() {
      console.log('#####################################')
      console.log('#####################################')
      console.log(this.$ability)
      console.log('Delete', this.$can('delete', 'User'))
      console.log('Read', this.$can('update', 'User'))
      console.log('manage', this.$can('manage', 'all'))
    }
  },
};
</script>