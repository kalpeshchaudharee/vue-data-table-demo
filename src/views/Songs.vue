<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <SongList />
  </div>
</template>

<script>
// @ is an alias to /src
import SongList from "@/components/SongList.vue";

export default {
  name: "Songs",
  components: {
    SongList
  }
};
</script>
