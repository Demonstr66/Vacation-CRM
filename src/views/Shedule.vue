<template>
  <div>
    <v-row class="pa-0 ma-0">
      <v-col>
        <ScheduleItem
        />
      </v-col>
    </v-row>
<!--    <span v-else>-->
<!--      Не добавлено ни одного графика-->
<!--    </span>-->
  </div>
</template>

<script>
import {defSchedule} from "@/plugins/schema";
import ScheduleItem from "@/components/ScheduleItem";

export default {
  components: {ScheduleItem},
  data: () => ({
  })
}
</script>

