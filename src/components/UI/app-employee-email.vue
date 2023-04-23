<template functional>
  <a :href="'mailto:'+props.email" class="text--secondary">
    {{ props.email }}
  </a>
</template>