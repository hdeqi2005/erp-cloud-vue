<template>
	<Dropdown trigger="contextMenu" transfer placement="right-start" :style="{width:'100%'}" @on-click="dropdownClick">
		<div>
			<slot></slot>
		</div>
		<DropdownMenu v-show="showContextMenu" slot="list">
			<DropdownItem   name="menu-insert"><Icon type="md-arrow-forward" />插入</DropdownItem>
			<DropdownItem v-if="showEdit" divided :style="{color:'#0cb05b'}" name="menu-edit"><Icon type="md-reorder" />编辑</DropdownItem>
			<DropdownItem divided :style="{color:'#ed4014'}" name="menu-delete"><Icon type="ios-trash" />删除</DropdownItem>
			<DropdownItem divided :style="{color:'#0cb05b'}" name="menu-updata">
				<i class="ivu-icon ivu-icon-md-add"></i>增加
			</DropdownItem>
		</DropdownMenu>
	</Dropdown>
</template>

<script>
	export default {
		name:'rightMenu',
		props:{
			showContextMenu:{
				type:Boolean,
				default:true
			},
			row_index:{
				type:Number|String
			},
			// 是否显示编辑项
			showEdit:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				index:this.row_index
			}
		},
		watch:{
			row_index(n,o){
				this.index = n;
			}
		},
		methods:{
			dropdownClick(name){
				this.$emit(name,this.index);
			}
		}
	}
</script>

<style>
</style>
