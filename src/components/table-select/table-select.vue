<template>
  <select class="table-select ivu-select-selection" size="small" v-model="value" v-bind="$attrs" @change="onChange">
    <slot></slot>
  </select>
</template>

<script>
  export default{
    name:'tableSelect',
    data(){
      return{

      }
    },props:{
      value:undefined
    },methods:{
      onChange(e){
        this.$emit('change',e.target.value,e);
      }
    }
  }
</script>

<style>
  .table-select {
    width: 100%;
    height: 24px;
    border: 0;
    color: #666;
  }
</style>
