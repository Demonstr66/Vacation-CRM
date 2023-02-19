<template>
  <app-base-sheet>
    <the-template-vacation-file/>
  </app-base-sheet>
</template>

<script>
import TheTemplateVacationFile from "@/components/workspace/TheTemplateVacationFile";
import AppBaseSheet from "@/layouts/AppBaseSheet";

export default {
  name: "template",
  components: {AppBaseSheet, TheTemplateVacationFile}
}
</script>

<style scoped>

</style>