<template>
  <div>
    <div>
      <button v-show="!show" @click="show = true">显示登录账户</button>
      <form v-show="show" method="post" action="/acc/login">
        email:
        <input type="email" name="email" /> 
        password:
        <input type="password" name="password" />
        &nbsp;
        <input type="submit" value="submit" @click="show = false" />
      </form>
    </div>
    <br>
    <ed-header />
    <ed-body />
    <ed-footer />
  </div>
</template>
<script>
import EdHeader from "./components/EdHeader";
import EdFooter from "./components/EdFooter";
import EdBody from "./components/EdBody";
export default {
  name: "App",
  data(){
return{
  show:false,
}
  },
  components: {
    EdHeader,
    EdFooter,
    EdBody,
  },
};
</script>
<style scoped>
div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

button {
  /* 通用样式 */
  display: inline-block;
  padding: 5px 20px;
  margin: 0px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;

  /* 按钮颜色 */
  background-color: #fff;
  color: #333;
}
  /* 悬停样式 */
  button:hover {
    background-color: #ddd;
    color: #000;
  }

  /* 点击样式 */
  button:active {
    background-color: #ccc;
    color: #000;
  }


</style>