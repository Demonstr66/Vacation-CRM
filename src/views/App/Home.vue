<template>
  <div>
    <v-btn @click="test">Success</v-btn>
  </div>
</template>


<script>
import MainTools from "@/components/user/tools/main";
import {messageHelper} from "@/mixins/messageHelper";
import AccountUserInfo from "@/components/user/info/account";

export default {
  components: {AccountUserInfo, MainTools},
  mixins: [messageHelper],
  data: () => ({}),
  methods: {
    test() {

    },
  },
};
</script>