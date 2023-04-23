<template>
  <div>
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

        <icon-btn-with-tip
            btn-class="ml-2"
            btn-style="border-radius: 4px; border-color: rgba(0, 0, 0, 0.12);"
            color="primary"
            icon="mdi-arrow-top-right"
            outlined
            @click="$emit('export')"
        >
          Экспорт
        </icon-btn-with-tip>
      </div>
      <v-btn
          v-if="!allUsersRegistered"
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
  </div>
</template>
<script>
import IconBtnWithTip from "@/components/IconBtnWithTip"
import {User} from "@/plugins/servises/User";

export default {
  name: 'organization-employees-tools',
  components: {IconBtnWithTip},
  someUser: new User(),
  props: {
    inviting: {
      type: Boolean,
      default: false
    },
    allUsersRegistered: {
      type: Boolean,
      default: true
    }
  }
}
</script>