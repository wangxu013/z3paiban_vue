<template>
  <div id="header-length">
    <!-- <h1>EdHeader</h1> -->
    <div  class="ed-header">
    
    <div class="day-box">
      <div @click="goLastWeek">上周◀◀</div>&nbsp;
      <div>{{ displayDate }}</div>&nbsp;
      <div @click="goNextWeek">▶▶下周</div>&nbsp;
    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <label id="ios_ui_switch">
      <input type="checkbox" :checked="isEditable" @click="switchButton" />
      <span class="slider"></span>
    </label>
    解锁编辑
    </div>
  </div>
</template>

<script>
import { getWeekStr} from "../js/getWeekDays";

export default {
  name: "EdHeader",
  props: [],
  data() {
    return {
      isEditable: false,
      date: new Date(),
    };
  },
  computed: {
    displayDate() {
      //?判断日期属于哪一周？
      return getWeekStr(this.date);


    },
  },
  methods: {
    switchButton() {
      this.isEditable = !this.isEditable;
      this.$bus.$emit("iseditablechange", this.isEditable);
    },
    weekPlus(dateInput, number) {
      const today = new Date(dateInput);
      today.setDate(today.getDate() + number * 7);
      return today;
    },
    goNextWeek() {
      this.date = this.weekPlus(this.date, 1);
      this.$bus.$emit("changeDate", this.date);
    },
    goLastWeek() {
      this.date = this.weekPlus(this.date, -1);
      this.$bus.$emit("changeDate", this.date);
    },
  },
};
</script>


<style scoped>
#header-length{
  width: 700px;

}
div.ed-header{
  display: flex;
  align-items:center;

}
div.day-box{
  display: flex;
}
/* #region ios_ui_switch*/
#ios_ui_switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

#ios_ui_switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

#ios_ui_switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cccccc6d;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;
}

#ios_ui_switch .slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: rgba(255, 255, 255, 0.547);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

#ios_ui_switch input:focus + .slider {
  box-shadow: 0 0 2px #2196f3;
}

#ios_ui_switch input:checked + .slider {
  background-color: #2196f3;
}

#ios_ui_switch input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}
/* #endregion ios_ui_switch*/
</style>


