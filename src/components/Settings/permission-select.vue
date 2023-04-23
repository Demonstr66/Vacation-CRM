<template>
  <v-select
      v-model="model"
      :items="$options.userGroups"
      item-value="level"
      hide-details
      multiple
      dense
      single-line
      @change="(val) => $emit('input', val)"
  >
    <template v-slot:prepend>
      <input-icon>mdi-account-group</input-icon>
    </template>
    <template v-slot:selection="{item}">
      <v-chip label outlined :color="item.color" small>
        {{ item.title.short }}
      </v-chip>
    </template>
  </v-select>
</template>
<script>
import InputIcon from "@/components/InputIcon"
import {USER_GROUPS} from "@/plugins/CONSTANTS";

let userGroups = USER_GROUPS
    .map(group => {
      if (group.key === 'owner') {
        group.disabled = true
      }
      group.text = group.title.short
      return group
    })
    .filter(group => group.key !== 'user')

export default {
  name: 'account-permission-select',
  components: {InputIcon},
  userGroups,
  props: {
    value: {
      type: Array
    },
    label: {
      type: String,
      default: "Кто может"
    }
  },
  data() {
    return {
      model: this.$props.value || []
    }
  }
}
</script>
