<template>
	<view v-html="payGateWay">{{payGateWay}}</view>
</template>

<script>
  export default {
    data(){
      return {
        payGateWay:''
      }
    } ,
    mounted () {
      let form = this.$route.query.htmlData;
      this.payGateWay = form;
      this.$nextTick(()=> {
        document.forms[0].submit();
      })
      console.log(this.payGateWay);
    }
  }
</script>

<style scoped></style>
