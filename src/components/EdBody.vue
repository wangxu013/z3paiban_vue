<template>
  <div>
    <!-- <h1>EdBody</h1> -->
    <form
      class="bodyrow-add-schedule"
      v-show="iseditable"
      @submit.prevent="addNewDataset"
    >
      <div>
        <span></span>
        <button class="add-button">Add New</button>
        <select v-model="newScheduleData.pos">
          <option value="host">host</option>
          <option value="bartender">bartender</option>
          <option value="server">server</option>
          <option value="busser">busser</option>
          <option value="trainee">trainee</option>
          <option value="reserved">reserved</option>
        </select>
      </div>

      <div class="input-worker-group">
        <label v-for="worker in workers" :key="worker.split('-')[2]">
          <input
            type="checkbox"
            v-model="newScheduleData.id_name"
            :value="worker.split('-')[2] + '-' + worker.split('-')[3]"
          />
          {{ worker.split("-")[3]
          }}<sup v-if="worker.split('-')[0] == 'partTime'" style="color: blue">
            PT</sup
          >
        </label>
      </div>
    </form>

    <br />
    <div>
      <tbody
        v-for="(schedules, pos) in datasets"
        :key="pos"
        :class="'table ' + pos"
      >
        <tr>
          <th>pos</th>
          <th>name</th>
          <td>{{ returnDate(1) }}</td>
          <td>{{ returnDate(2) }}</td>
          <td>{{ returnDate(3) }}</td>
          <td>{{ returnDate(4) }}</td>
          <td>{{ returnDate(5) }}</td>
          <td>{{ returnDate(6) }}</td>
          <td>{{ returnDate(7) }}</td>
        </tr>
        <table-row
          v-for="(schedule, id_name) in schedules"
          :key="id_name"
          :schedule="schedule"
          :pos="pos"
          :id_name="id_name"
          :iseditable="iseditable"
        />
        <br />
      </tbody>
    </div>
    <button class="submit-button" @click="submitScheduleData">Update Data</button>
  </div>
</template>

<script>
//#region temporary data
let tDataWorkers = [
  {
    name: "Jacky",
    number: "23820", //排序3
    status: "onJob", //排序1
    posNumber: "1", //排序2
  },
];
let tData = [
  {
    idnum: "23918",
    pos: "host",
    time: "thu_pm",
    name: "Jesse",
  },
  {
    idnum: "23918",
    pos: "busser",
    time: "sun_pm",
    name: "Jesse",
  },
];
//#endregion

//?request "填表蓝图"的数据resData
// let date = "1/22/2024";
// let resData = await fetch(url + `${date}`, {
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// }).then(res => res.json()).catch(err => console.log(err));

// console.log(resData);
/*
! 结果:
[{
 "idnum": "23919",
 "pos": "bartender",
 "time": "mon_pm",
 "name": "Jason"
},
 {...}]
 */
//#定义函数:从 resData 转化成==> datasets对象
/**
 * 将下载过来的数据转化成需要的格式
 * @resData -参数格式:[
    {
      idnum: "19901",
      pos: "server",
      time: "mon_am",
      name: "jacky",
    },
    {...}
  ]
 * @returns -返回数据的格式:{
  server: {
    "19901-jacky": {
      mon: { 0: "am", 1: true },
      tue: { 0: "off", 1: true },
      wed: { 0: "off", 1: true },
      thu: { 0: "all", 1: true },
      fri: { 0: "all", 1: true },
      sat: { 0: "pm", 1: true },
      sun: { 0: "all", 1: true },
    },{...}
  }
*/
function resDataToDatasets(resData) {
  let newData = [];
  //?对遍历响应回来的resData,进行整理,==>newData
  /*
newData = [{
    pos,
    id_name,
    day,
    shift,
  },
  {...}]
*/
  for (let i = 0; i < resData.length; i++) {
    let pos = resData[i].pos;
    let [day, shift] = resData[i].time.split("_");
    //合成id_name:"23922-jacky"
    let id_name = resData[i].idnum + "-" + resData[i].name;
    let obj = {
      pos,
      id_name,
      day,
      shift,
    };
    newData.push(obj);
  }
  // console.log(newData);

  //?将newData按照pos,id_name,shift分组. ==>成newDataGroup
  /*  newDataGroup: {
      server: {
        "23922-jacky": {
          mon: ["am","pm"],
          thu: ["am","pm"],
          fri: ["am","pm"],
          sat: ["pm"],
          sun: ["am","pm"]
        },...
*/
  let newDataGroup = {};

  for (let i = 0; i < newData.length; i++) {
    let pos = newData[i].pos;
    let id_name = newData[i].id_name;
    // let shift = newData[i].shift;
    let day = newData[i].day;
    if (!newDataGroup[pos]) {
      newDataGroup[pos] = {};
    }
    if (!newDataGroup[pos][id_name]) {
      newDataGroup[pos][id_name] = {};
    }
    if (!newDataGroup[pos][id_name][day]) {
      newDataGroup[pos][id_name][day] = [];
    }
    newDataGroup[pos][id_name][day].push(newData[i].shift);
    // console.log(newDataGroup);
  }
  //?替换am或pm只有一个的;替换'am''pm'都有的. 即newDataGroup符合格式==>datasets
  /*
newDataGroup: {
  server: {
    "23922-jacky": {
      mon: { 0: "all", 1: true },
      tue: { 0: "off", 1: true },
      wed: { 0: "off", 1: true },
      thu: { 0: "all", 1: true },
      fri: { 0: "all", 1: true },
      sat: { 0: "pm", 1: true },
      sun: { 0: "all", 1: true },
    },
*/
  for (let [key, value] of Object.entries(newDataGroup)) {
    for (let [ke, val] of Object.entries(value)) {
      //!先将周某天有数据的替换成要求的格式。
      for (let [k, v] of Object.entries(val)) {
        if (v.length == 1) {
          let tpl = v[0];
          newDataGroup[key][ke][k] = { 0: `${tpl}`, 1: "true" };
        } else if (v.length == 2) {
          newDataGroup[key][ke][k] = { 0: "all", 1: "true" };
        }
      }
      //!再将周某天缺的数据补上，补上值为空。
      let weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
      for (let weekday of weekdays) {
        if (!newDataGroup[key][ke][`${weekday}`]) {
          newDataGroup[key][ke][`${weekday}`] = { 0: "off", 1: "true" };
        }
      }
    }
  }
  // console.log(newDataGroup);
  return newDataGroup;
}
//#定义函数:从 resData 转化成==> workers数组
/**
 * 将下载过来的数据转化成需要的格式
 * @resData -参数格式:[
    {
      "name": "jacky",
      "number": "19901",//排序3
     "status": "onJob",//排序1
     "posNumber": "1",//排序2
    },
    {...}
  ]
* @returns -返回数据的格式:{
  [
    "onJob-1-19901-jacky",
    "partTime-1-20802-lucy",
    ...
  ]
*/
function resDataToWorkers(resData) {
  let workers = [];
  resData.forEach((item) => {
    workers.push(
      item.status + "-" + item.posNumber + "-" + item.number + "-" + item.name
    );
  });
  //按数据的字符串排序
  workers.sort();
  return workers;
}

//#定时从数据库取回的刷新值

// let refreshData;
// setInterval(() => {
//   refreshData = resDataToDatasets(tData);
// }, 3000);

import axios from "axios";

import TableRow from "./TableRow.vue";
import { getWeekDates, getWeekDayNumber } from "../js/getWeekDays";

export default {
  name: "EdBody",
  components: {
    TableRow,
  },
  props: [],
  data() {
    return {
      //*定时从数据库取回的刷新值
      refreshData: resDataToDatasets(tData),
      //*现实状态的值
      datasets: resDataToDatasets(tData),
      // datasets: {
      //   server: {
      //     "23922-jacky": {
      //       mon: { 0: "all", 1: true },
      //       tue: { 0: "", 1: true },
      //       wed: { 0: "", 1: true },
      //       thu: { 0: "all", 1: true },
      //       fri: { 0: "all", 1: true },
      //       sat: { 0: "pm", 1: true },
      //       sun: { 0: "all", 1: true },
      //     },
      //     "23911-jone": {
      iseditable: false,
      countClick: 0,
      clickEventData: {},
      workers: resDataToWorkers(tDataWorkers),
      newScheduleData: {
        pos: "server",
        id_name: [],
      },
      displayDate: new Date(),
    };
  },
  computed: {
    //?生成数据库格式的schedule数据。
    dbScheduleData() {
      let data = [];
      //!遍历datasets数据。
      for (let [key_pos, value] of Object.entries(this.datasets)) {
        for (let [ke_id_name, val] of Object.entries(value)) {
          for (let [k_day, v] of Object.entries(val)) {
            let obj = {};
            // console.log(k_day,v);
            if (v[0] == "all" || v[0] == "am" || v[0] == "pm") {
              obj.employeename = ke_id_name.split("-")[1];
              obj.employeenumber = ke_id_name.split("-")[0];
              //!根据日期和星期得到正确的日期。
              obj.workdate = getWeekDates(this.displayDate)[
                getWeekDayNumber(k_day) - 1
              ].toLocaleDateString();
              obj.createdate = new Date();
              obj.position = key_pos;
              obj.remarks = "";
            }
            //*add to data
            if (v[0] == "all") {
              obj.shift = "am";
              data.push(obj);
              //克隆一个对象
              let clonedObj = JSON.parse(JSON.stringify(obj));
              clonedObj.createdate = new Date();
              clonedObj.shift = "pm";
              data.push(clonedObj);
            } else if (v[0] == "am") {
              obj.shift = "am";
              data.push(obj);
            } else if (v[0] == "pm") {
              obj.shift = "pm";
              data.push(obj);
            }
          }
        }
      }
      return data;
    },
    scheduleByWorker() {
      //按照人名统计，每天工作时间的安排，以便于发现某天工作安排的时间有重复。
      //统一调整为:某人,某星期,有几个am几个pm的班次
      let schedule = {};
      /* 
      {
        name:{
          mon:[],
          tue:[],
          wed:[],
          thu:[],
        },{...}
      }
        */

      for (let value of Object.values(this.datasets)) {
        for (let [ke_name, val] of Object.entries(value)) {
          for (let [k_day, v] of Object.entries(val)) {
            if (!schedule[ke_name]) {
              schedule[ke_name] = {};
            }
            if (!schedule[ke_name][k_day]) {
              schedule[ke_name][k_day] = [];
            }
            if (v[0] == "all") {
              schedule[ke_name][k_day].push("am");
              schedule[ke_name][k_day].push("pm");
            } else if (v[0] == "am" || v[0] == "pm") {
              schedule[ke_name][k_day].push(v[0]);
            }
          }
        }
      }
      // console.log(schedule);
      return schedule;
    },
  },
  methods: {
    //?切换可编辑按钮状态。
    iseditablechange(data) {
      this.iseditable = data;
      // console.log("body里的iseditable", data);
    },
    // ?修改班次
    changeshift(pos, id_name, day) {
      //!先判断iseditable是false,则直接跳出
      if (!this.iseditable) {
        console.log("no edit table's data ", this.countClick++);
        if (this.countClick % 5 === 0) {
          alert(
            'can not edit now, if you want change a shift, go switch the button "解锁编辑'
          );
        }
        return;
      }
      //*记录下点击当时的状态和值
      this.clickEventData.path = [pos, id_name, day];
      this.clickEventData.oldValue = [];

      this.clickEventData.oldValue.push(this.datasets[pos][id_name][day][0]);
      this.clickEventData.oldValue.push(this.datasets[pos][id_name][day][1]);

      //!找到key为id_name的对象,修改day下的值,轮'','all','pm','am'

      let tpl = this.datasets[pos][id_name][day][0];
      // console.log("tpl", tpl);
      this.datasets[pos][id_name][day][0] =
        tpl == "off" ? "am" : tpl == "am" ? "all" : tpl == "all" ? "pm" : "off";
      //*修改保存状态,对比refreshData
      //Pos不存在或者pos ID_name不存在
      if (!this.refreshData[pos]||!this.refreshData[pos][id_name]) {
        this.datasets[pos][id_name][day][1] = "false";
      } else if (
        this.datasets[pos][id_name][day][0] ==
        this.refreshData[pos][id_name][day][0]
      ) {
        this.datasets[pos][id_name][day][1] = "true";
      } else {
        this.datasets[pos][id_name][day][1] = "false";
      }
    },
    // ?删除班次
    delScheduleRow(pos, id_name) {
      if (!confirm("确定删除该行工作的时间安排!!!")) {
        return;
      }
      this.$delete(this.datasets[pos], [id_name]);
    },

    // ?添加班次
    addNewDataset() {
      let pos = this.newScheduleData.pos;
      let names = this.newScheduleData.id_name;
      names.forEach((name) => {
        if (!this.datasets[pos]) {
          this.$set(this.datasets, [pos], {});
        }
        if (!this.datasets[pos][name]) {
          this.$set(this.datasets[pos], [name], {
            mon: { 0: "off", 1: "false" },
            tue: { 0: "off", 1: "false" },
            wed: { 0: "off", 1: "false" },
            thu: { 0: "off", 1: "false" },
            fri: { 0: "off", 1: "false" },
            sat: { 0: "off", 1: "false" },
            sun: { 0: "off", 1: "false" },
          });
        }
      });
    },
    //?上传数据数到服务器
    submitScheduleData() {
      //!获取数据库格式data
      let data = this.dbScheduleData;
      let _this = this;
      console.log(data);
      //!提交data
      submitData(data);
      async function submitData(data) {
        let resResult = await fetch("/admin/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        let jsonResult = await resResult.json();

        console.log("submitData response.json():", jsonResult);
        //!返回成功时。刷新refreshData和datasets数据。并且弹出保存数据成功弹窗。
        _this.refreshPageDate();
        alert("数据已上传保存");

        return jsonResult;
      }
    },
    //?edHeader改变日期调用该函数
    changeDate(date) {
      this.displayDate = date;
    },
    //?返回表头所需要的日期。
    returnDate(dayNum) {
      let date = getWeekDates(this.displayDate)[dayNum - 1];
      return (
        date.toLocaleDateString().slice(0, -5) +
        " " +
        date.toDateString().slice(0, 3)
      );
    },
    //?根据日期刷新页面
    refreshPageDate(dateInput = this.displayDate.toLocaleDateString()) {
      //#更新schedule数据。
      let _this = this;
      //!获取新日期下的db数据
      async function getData(d) {
        let tableBlueprint;
        await axios
          .get("/admin/tabledata?date=" + `${d}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => (tableBlueprint = res.data))
          .catch((err) => console.log(err));
        let t = resDataToDatasets(tableBlueprint);
        //排除空值
        if (t) {
          //克隆一个对象
          _this.datasets = JSON.parse(JSON.stringify(t));
          _this.refreshData = JSON.parse(JSON.stringify(t));
        }
      }
      //*执行getData()
      getData(dateInput);

      //#更新可上班的员工数据。
      // //!发送fetch 请求到 服务器,得到 employee数据workers_db
      async function getWorkers() {
        let workers_db = await fetch("/admin/getemployeedb")
          .then((res) => res.json())
          .catch((err) => {
            console.log("fetch得到ep db err:" + err);
          });
        // let ep_db = await workers_db.json();
        let tmp = resDataToWorkers(workers_db);
        //排除空值
        if (tmp) {
          _this.workers = tmp;
        }
      }
      //*启动执行
      getWorkers();
    },
  },
  watch: {
    //?可编辑是否改变
    iseditable(newVal) {
      if (newVal) {
        this.countClick = 0;
      }
    },
    //?检测同一个人的上班时间数是否有冲突
    datasets: {
      // immediate:true,//初始化时让handler调用一次
      deep: true, //深度监视,针对多级的
      handler() {
        console.log("schedule改动了");
        //^通过检查scheduleByWorker是否冲突,来判断修改是否合理。
        for (let [key_name, value] of Object.entries(this.scheduleByWorker)) {
          for (let [ke_day, val] of Object.entries(value)) {
            //!发现某人某星期有重复的am或者PM的班次
            if (val.length > new Set(val).size) {
              //*弹窗提醒班次有冲突
              alert(
                `${key_name}的星期--${ke_day}--的时间安排有冲突. 请重新调整!`
              );
              //*更新回之前旧的内容,使用记录下的点击时的状态和值
              this.datasets[this.clickEventData.path[0]][key_name][ke_day][0] =
                this.clickEventData.oldValue[0];
              this.datasets[this.clickEventData.path[0]][key_name][ke_day][1] =
                this.clickEventData.oldValue[1];
            }
          }
        }
      },
    },
    //?displayDate改变联动,更新页面
    displayDate: {
      immediate: true, //初始化时让handler调用一次

      handler() {
        //*刷新页面数据,不传参数默认就是displayDate。
        this.refreshPageDate();
      },
    },
  },
  mounted() {
    this.$bus.$on("iseditablechange", this.iseditablechange);
    this.$bus.$on("changeshift", this.changeshift);
    this.$bus.$on("delScheduleRow", this.delScheduleRow);
    this.$bus.$on("changeDate", this.changeDate);
  },
  beforeDestroy() {
    this.$bus.$off("iseditablechange");
    this.$bus.$off("changeshift");
    this.$bus.$off("delScheduleRow");
    this.$bus.$off("changeDate");
  },
};
</script>

<style >
tbody {
  padding: 5px;
}
</style>


// #region temporary css
<style>
/* select {
  width: 35%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

select option {
  padding: 5px;
  font-size: 16px;
} */

.bodyrow-add-schedule {
  width: 720px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px; /* 元素之间的间距 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
}

.add-button {
  width: 80px !important;
  height: 50px !important;
  background-color: #3491f3fe !important; /* 蓝色主题色 */
  color: #fff;
  border: none;
  border-radius: 15px !important;
  font-size: 14px !important;
  cursor: pointer;
}

.add-button:hover {
  background-color: rgba(200, 200, 203, 0.714) !important; /* 深蓝色 */
  color: #0b0b0b9d !important;
}

select {
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.input-worker-group {
  display: flexbox;
}

label {
  display: inline-block;
  height: 35px;
  margin: 5px;
  align-items: center;
  gap: 5px;
  font-size: 16px;
  /* border: 1px solid rgba(0, 0, 0, 0.312); */
}

input[type="checkbox"] {
  margin-left: 12px;
}
</style>
<style scoped>
.add-button {
  margin: 10px;
  width: 42px;
  height: 38px;
  border-radius: 40%;
  background-color: #1e7600;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  line-height: 20px;
  cursor: pointer;
}

.add-button:hover {
  background-color: #ccc;
  color: #f40c0c;
}

.submit-button {
  /* 通用样式 */
  display: inline-block;
  padding: 10px 20px;
  margin: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  cursor: pointer;

  /* 按钮颜色 */
  background-color: #fff;
  color: #333;
}
  /* 悬停样式 */
.submit-button:hover {
    background-color: #ddd;
    color: #000;
  }

  /* 点击样式 */
.submit-button:active {
    background-color: #ccc;
    color: #000;
  }
</style>


<style lang="">
/*
?定义一个提交数据函数
async function submitData(data) {
     let resResult = await fetch('/admin/submit', {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
     });
     let jsonResult = await resResult.json();

     console.log("submitData response.json():", jsonResult);
     return jsonResult;
};

!提交data格式:
[
  {
  employeename: 'wang',
  employeenumber: 23122,
*这里的时间格式是mm/dd/yyyy
  workdate:'01/22/2024',
  shift:'pm',
  createdate: new Date(),
  position:'sever',
  remarks: ""
},
{...}
]
?request "填表蓝图"
  let tableBlueprint = await fetch(url + `${date}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json()).catch(err => console.log(err));

  console.log(tableBlueprint);
 ! 结果:
{
    "idnum": "23919",//排序1
    "pos": "bartender",
    "time": "mon_pm",
    "name": "Jason"
}
?发送fetch 请求到 服务器,得到 employee数据ep_db
  let workers_db = await fetch('/admin/getemployeedb').catch(err => { console.log("fetch得到ep db err:" + err); });
  let ep_db = await workers_db.json();
  console.log(ep_db);
  ! 结果:
  {
    "name": "Jacky",
    "number": "23820",//排序3
    "status": "onJob",//排序1
    "posNumber": "1",//排序2
  }
*/
</style>


