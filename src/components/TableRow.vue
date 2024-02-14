<template>
  <tr>
    <th>
      <button
        v-show="iseditable"
        @click="delScheduleRow_e(pos, id_name, iseditable)"
      >
        DEL</button
      >&nbsp;&nbsp;{{ pos }}
    </th>
    <th :data-id_name="id_name">{{ id_name.split("-")[1] }}</th>
    <td
      :class="schedule.mon[0]"
      :data-saved="schedule.mon[1]"
      @click="changeShift_emit(pos, id_name, 'mon')"
    >
      {{ schedule.mon[0] }}
    </td>
    <td
      :class="schedule.tue[0]"
      :data-saved="schedule.tue[1]"
      @click="changeShift_emit(pos, id_name, 'tue')"
    >
      {{ schedule.tue[0] }}
    </td>
    <td
      :class="schedule.wed[0]"
      :data-saved="schedule.wed[1]"
      @click="changeShift_emit(pos, id_name, 'wed')"
    >
      {{ schedule.wed[0] }}
    </td>
    <td
      :class="schedule.thu[0]"
      :data-saved="schedule.thu[1]"
      @click="changeShift_emit(pos, id_name, 'thu')"
    >
      {{ schedule.thu[0] }}
    </td>
    <td
      :class="schedule.fri[0]"
      :data-saved="schedule.fri[1]"
      @click="changeShift_emit(pos, id_name, 'fri')"
    >
      {{ schedule.fri[0] }}
    </td>
    <td
      :class="schedule.sat[0]"
      :data-saved="schedule.sat[1]"
      @click="changeShift_emit(pos, id_name, 'sat')"
    >
      {{ schedule.sat[0] }}
    </td>
    <td
      :class="schedule.sun[0]"
      :data-saved="schedule.sun[1]"
      @click="changeShift_emit(pos, id_name, 'sun')"
    >
      {{ schedule.sun[0] }}
    </td>
  </tr>
</template>

<script>
export default {
  name: "TableRow",
  props: ["schedule", "pos", "id_name", "iseditable"],
  data() {
    return {};
  },
  methods: {
    changeShift_emit(pos, id_name, day) {
      this.$bus.$emit("changeshift", pos, id_name, day);
    },
    delScheduleRow_e(pos, id_name, iseditable) {
      if (iseditable) {
        this.$bus.$emit("delScheduleRow", pos, id_name);
      }
    },
  },
};
</script>




<style scoped>
/* --td-after-width: 20px; */

table {
  border-collapse: collapse;
  width: 100%;
  font-family: sans-serif;
  font-size: 16px;
  color: #333;
}

th,
td {
  position: relative;
  padding: 10px 10px;
  border: 1px solid #ccc;
}

td {
  width: 54px;
  height: 32px;
  color: #fe000000;
}

tbody {
  background-color: #fff;
  border-bottom: 2px solid #ddd;
  margin-bottom: 5px;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

tr:nth-child(odd) {
  background-color: #f6f6f6;
}

tr:hover {
  background-color: #e9e9e9;
}

td[data-saved="false"]:before {
  position: absolute;
  width: 7px;
  height: 7px;
  left: 4px;
  top: 4px;
  border-radius: 50%;
  content: "";
  background-color: rgba(255, 64, 0, 0.585);
}

.pm,
.am,
.all,
.off {
  position: relative;
}

.pm:after,
.am:after,
.all:after,
.off:after {
  position: absolute;
  content: "";
  width: 20px;
  height: 20px;
  left: 25px;
  top: 18px;
  border-radius: 50%;
  background-clip: content-box;
}

.pm:after {
  /* ... */
  background-color: rgba(93, 149, 238, 0.795);
  clip-path: polygon(0 100%, 0 50%, 100% 50%, 100% 100%);
}

.am:after {
  /* ... */
  background-color: rgba(97, 225, 248, 0.795);
  clip-path: polygon(0 0, 0 50%, 100% 50%, 100% 0);
}

.all:after {
  /* ... */
  background-color: rgba(93, 115, 238, 0.795);
}

.off:after {
  /* ... */
  border: 1px solid #cccccc;
  background-color: rgba(246, 247, 251, 0.704);
}
</style>


