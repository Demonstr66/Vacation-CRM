<template>
  <div>
    <v-btn @click="test">Success</v-btn>
  </div>
</template>


<script>
import MainTools from "@/components/user/tools/main";
import {messageHelper} from "@/mixins/MessageMethods";

export default {
  components: {MainTools},
  mixins: [messageHelper],
  data: () => ({}),
  methods: {
    test() {

    },
  },
};
</script>