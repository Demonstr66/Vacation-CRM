<template>
  <div>
    <v-btn @click="test">Success</v-btn>
    <v-text-field>
      <template v-slot:append="item">
        <v-btn icon>
          <v-icon>
            mdi-minus-circle-outline
          </v-icon>
        </v-btn>
      </template>
    </v-text-field>
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