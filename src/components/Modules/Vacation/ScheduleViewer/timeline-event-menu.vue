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
          <VacationStatusChip
              :status="vacation.status"
              :statuses="statuses"
          />
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
          :status="vacation.status"

          :approve-disabled="!$can('approve', normalizeVacation)"
          :reject-disabled="!$can('reject', normalizeVacation)"
          :cancel-disabled="!$can('cancel', normalizeVacation)"

          @approve="approveVacation(vacation.id)"
          @reject="rejectVacation(vacation.id)"
          @cancel="cancelVacation(vacation.id)"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
import {getShortUserNameByUID} from "@/mixins/ComputedData";
import {normalizeDate} from "@/mixins/Filters";
import VacationStatusChip from "@/components/AppStatusChip";
import VacationRangeLabel from "@/components/VacationRangeLabel";
import VacationTools from "@/components/Modules/Vacation/vacation-controls";
import {Vacation} from "@/plugins/servises/Vacation";

export default {
  name: 'EventMenu',
  components: {VacationTools, VacationStatusChip, VacationRangeLabel},
  mixins: [getShortUserNameByUID, normalizeDate],
  inject: ['rejectVacation', 'cancelVacation', 'approveVacation'],
  props: {
    vacation: {}
  },
  data: () => ({
    statuses: Vacation.statuses
  }),
  computed: {
    normalizeVacation() {
      return new Vacation(this.vacation)
    }
  }
}
</script>