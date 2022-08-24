<template>
  <v-card>
    <v-card-title class="subtitle-1">
      {{ getShortUserNameByUID(vacation.uid) }}
    </v-card-title>
    <v-card-subtitle>
      <VacationRangeLabel :start="vacation.start" :end="vacation.end"/>
    </v-card-subtitle>
    <v-divider/>
    <v-card-text>
      <v-row dense justify="space-between" no-gutters>
        <v-col cols="auto"><span class="font-weight-medium">Статус: </span></v-col>
        <v-col class="ml-2" cols="auto">
          <VacationStatusChip :status="vacation.status"/>
        </v-col>
      </v-row>
      <v-row v-if="vacation.statusChangeByUid" dense justify="space-between" no-gutters>
        <v-col cols="auto"><span class="font-weight-medium">Кем: </span></v-col>
        <v-col class="ml-2" cols="auto">
          {{ getShortUserNameByUID(vacation.statusChangeByUid) }}
        </v-col>
      </v-row>
      <v-row dense justify="space-between" no-gutters>
        <v-col cols="auto"><span class="font-weight-medium">Когда: </span></v-col>
        <v-col class="ml-2" cols="auto">
          {{ $moment(vacation.statusChangeAt).format('DD.MM.YYYY HH:mm') }}
        </v-col>
      </v-row>

    </v-card-text>
    <v-card-actions>
      <VacationTools
        :vacation="vacation"
        @click="(data) => $emit('click', data)"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {getShortUserNameByUID} from "@/mixins/ComputedData";
import {normalizeDate} from "@/mixins/Filters";
import VacationStatusChip from "@/views/App/VacationStatusChip";
import VacationRangeLabel from "@/views/App/VacationRangeLabel";
import VacationTools from "@/components/ScheduleViewer/VacationTools";

export default {
  name: 'EventMenu',
  components: {VacationTools, VacationStatusChip, VacationRangeLabel},
  mixins: [getShortUserNameByUID, normalizeDate],
  props: {
    vacation: {}
  },
  data: () => ({})
}
</script>