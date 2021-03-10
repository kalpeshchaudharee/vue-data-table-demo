<template>
  <v-app id="inspire">
    <v-card>
      <v-card-title>
        <v-text-field
          v-model="id"
          v-if="columnValues.includes('ID')"
          label="Search ID"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="name"
          v-if="columnValues.includes('Song Name')"
          label="Search Song Name"
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="columnValues.includes('Album')"
          v-model="album"
          label="Search Album"
        ></v-text-field>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-select
        v-model="columnValues"
        :items="columns"
        chips
        label="Select Column"
        multiple
        outlined
      ></v-select>
      <v-data-table
        :headers="headers"
        fixed-header
        :items="dessertsLimited"
        :sort-by="['id', 'name', 'album']"
        :sort-desc="[false, true]"
        class="elevation-1"
        height="50vh"
        v-sortable-table="{ onEnd: sortTheHeadersAndUpdateTheKey }"
        :key="anIncreasingNumber"
        id="virtual-scroll-table"
        v-scroll:#virtual-scroll-table="onScroll"
        dense
        disable-pagination
        hide-default-footer
      >
        <template v-if="start > 0" v-slot:body.prepend>
          <tr>
            <td
              :colspan="headers.length"
              :style="'padding-top:' + startHeight + 'px'"
            ></td>
          </tr>
        </template>
        <template
          v-if="start + perPage < this.tableData.length"
          v-slot:body.append
        >
          <tr>
            <td
              :colspan="headers.length"
              :style="'padding-top:' + endHeight + 'px'"
            ></td>
          </tr>
        </template>
        <!-- <template v-slot:body="props">
              <draggable :list="props.items" tag="tbody">
                <tr v-for="(song, index) in props.items" :key="index">
                  <td v-if="columnValues.length > 0">
                    <v-icon small class="page__grab-icon">
                      mdi-arrow-all
                    </v-icon>
                  </td>
                  <td v-if="columnValues.includes('ID')" class="text-left">
                    {{ song.id }}
                  </td>
                  <td v-if="columnValues.includes('Song Name')" class="text-left">
                    {{ song.name }}
                  </td>
                  <td v-if="columnValues.includes('Album')" class="text-left">
                    {{ song.album }}
                  </td>
                </tr>
              </draggable>
            </template> -->
      </v-data-table>
    </v-card>
  </v-app>
</template>

<style scoped>
#virtual-scroll-table {
  max-height: 400px;
  overflow: auto;
}
</style>
<script>
function watchClass(targetNode, classToWatch) {
  let lastClassState = targetNode.classList.contains(classToWatch);
  const observer = new MutationObserver(mutationsList => {
    for (let i = 0; i < mutationsList.length; i++) {
      const mutation = mutationsList[i];
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const currentClassState = mutation.target.classList.contains(
          classToWatch
        );
        if (lastClassState !== currentClassState) {
          lastClassState = currentClassState;
          if (!currentClassState) {
            mutation.target.classList.add("sortHandle");
          }
        }
      }
    }
  });
  observer.observe(targetNode, { attributes: true });
}

// import Draggable from "vuedraggable";
import Sortable from "sortablejs";
import _ from "lodash";
export default {
  name: "SongList",
  props: {},
  components: {
    // Draggable
  },
  data() {
    return {
      tableData: [],
      id: "",
      name: "",
      album: "",
      columns: [
        "ID",
        "Song Name",
        "Album",
        "Singer",
        "Director",
        "Producer",
        "Country",
        "Dancer"
      ],
      columnValues: [
        "ID",
        "Song Name",
        "Album",
        "Singer",
        "Director",
        "Producer",
        "Country",
        "Dancer"
      ],
      anIncreasingNumber: 0,
      start: 0,
      timeout: null,
      rowHeight: 5,
      perPage: 15
    };
  },
  computed: {
    headers() {
      var songList = [
        // { text: "", sortable: false }
      ];
      this.columnValues.map(columnName => {
        var key;
        var filterValues;
        if (columnName == "ID") {
          key = "id";
          filterValues = value => {
            if (!this.id) return true;

            return value == this.id;
          };
        }
        if (columnName == "Song Name") {
          key = "name";
          filterValues = value => {
            if (!this.name) return true;

            return value == this.name;
          };
        }
        if (columnName == "Album") {
          key = "album";
          filterValues = value => {
            if (!this.album) return true;

            return value == this.album;
          };
        }
        if (columnName == "Singer") {
          key = "singer";
          filterValues = value => {
            if (!this.singer) return true;

            return value == this.singer;
          };
        }
        if (columnName == "Director") {
          key = "director";
          filterValues = value => {
            if (!this.director) return true;

            return value == this.director;
          };
        }
        if (columnName == "Producer") {
          key = "producer";
          filterValues = value => {
            if (!this.producer) return true;

            return value == this.producer;
          };
        }
        if (columnName == "Country") {
          key = "country";
          filterValues = value => {
            if (!this.country) return true;

            return value == this.country;
          };
        }
        if (columnName == "Dancer") {
          key = "dancer";
          filterValues = value => {
            if (!this.dancer) return true;

            return value == this.dancer;
          };
        }
        songList.push({
          text: columnName,
          value: key,
          filter: filterValues
        });
      });
      return songList;
    },
    dessertsLimited() {
      debugger;
      return this.tableData.slice(this.start, this.perPage + this.start);
    },
    startHeight() {
      debugger;
      return this.start * this.rowHeight - 32;
    },
    endHeight() {
      debugger;
      return this.rowHeight * (this.tableData.length - this.start);
    }
  },
  created() {
    this.getResults();
  },
  methods: {
    async getResults() {
      await this.axios
        .get("http://localhost:8000/songs")
        .then(res => {
          this.tableData = res.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    async sortTheHeadersAndUpdateTheKey(evt) {
      const headersTmp = this.headers;
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      if (newIndex == 0) return true;
      if (oldIndex == 0) return true;
      if (newIndex >= headersTmp.length) {
        let k = newIndex - headersTmp.length + 1;
        while (k--) {
          headersTmp.push(undefined);
        }
      }
      headersTmp.splice(newIndex, 0, headersTmp.splice(oldIndex, 1)[0]);
      this.table = headersTmp;
      _.map(headersTmp, "text");
      var columns = _.map(headersTmp, "text");
      this.columns = columns;
      this.columnValues = columns;
      this.anIncreasingNumber += 1;
    },
    onScroll(e) {
      // debounce if scrolling fast
      this.timeout && clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        const { scrollTop } = e.target;
        const rows = Math.ceil(scrollTop / this.rowHeight);

        this.start =
          rows + this.perPage > this.tableData.length
            ? this.tableData.length - this.perPage
            : rows;

        this.$nextTick(() => {
          e.target.scrollTop = scrollTop;
        });
      }, 20);
    }
  },
  directives: {
    "sortable-table": {
      inserted: (el, binding) => {
        el.querySelectorAll("th").forEach(draggableEl => {
          if (draggableEl.cellIndex == 0) return true;
          // Need a class watcher because sorting v-data-table rows asc/desc removes the sortHandle class
          watchClass(draggableEl, "sortHandle");
          draggableEl.classList.add("sortHandle");
        });
        Sortable.create(
          el.querySelector("tr"),
          binding.value ? { ...binding.value, handle: ".sortHandle" } : {}
        );
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped>
</style> -->
