let commonFormat = {
  numberMarkFormat(value){
    value = new String(value).toString();
    //处理千分符
    if(!value || value == null || value == '' || value == '0'){
      return value;
    }
    let valueSplits = value.split(".");;
    let number = 0;
    try{
      number = Number(valueSplits[0]);
    }catch(e){
      //不是数字
      return value;
    }
    if(valueSplits.length > 1){
      return `${number.toLocaleString()}.${valueSplits[1]}`;
    }
    return number.toLocaleString();
  },decimalDigitsFormat(value,digits){
    if(!value || value == null || value == '' || value == 0){
      return value;
    }
    let valueStr = new String(value).toString();
    //找是否有小数点
    let dotIndex = valueStr.indexOf('.');
    if(dotIndex == -1){
      //整数也变成小数
      return Number(valueStr).toFixed(digits);
    }
    //有小数点要么补位，要么直接返回
    let valueSplits = valueStr.split(".");
    //小数点后面的位数要是小于指定的位置
    //长度不够需要补齐
    if(digits - valueSplits[1].length > 0){
      //被转换成字符串了
      value = Number(valueStr).toFixed(digits);
    }
    return this.numberMarkFormat(value);
  }
}

export default{
	numberMark(h,params){
		//千分符
		let field = params.column.key;
		let rowData = params.row;
		let value = rowData[field];
		let newValue = commonFormat.numberMarkFormat(value);
		return h('span',newValue);
	},
	statusFormat(h,params){
		let field = params.column.key;
		let rowData = params.row;
		let value = rowData[field];
		let v = value == undefined || value == null || value=='' || !value;
    let checkbox =  h('Checkbox',{
    	 props:{
    		 value:v,
    		 disabled:true,
         size:'small'
    	 }
     });
    return h('div',{
      attrs:{
        class:'checkbox-disabled'
      }
    },[checkbox]);
	},auditFormat(h,params){
		let field = params.column.key;
		let rowData = params.row;
		let value = rowData[field];
		if(value && value != null){
			 return h('span','已审');
		}
		return h('span','未审');
	},checkBoxFormat(h,params){
		let field = params.column.key;
		let rowData = params.row;
		let value = rowData[field];
		let v = value && value != null && value == true;
		return h('Checkbox',{
			 props:{
				 value:v,
				 disabled:true,
         size:'small'
			 }
		 });
	},decimalDigits2Format(h,params){
    //保留小数点后两位，不足补0
    let field = params.column.key;
    let rowData = params.row;
    let value = rowData[field];
    let formatValue = commonFormat.decimalDigitsFormat(value,2);
    return h('span',formatValue);
  },decimalDigits3Format(h,params){
    //保留小数点后两位，不足补0
    let field = params.column.key;
    let rowData = params.row;
    let value = rowData[field];
    let formatValue = commonFormat.decimalDigitsFormat(value,3);
    return h('span',formatValue);
  },decimalDigits4Format(h,params){
    //保留小数点后两位，不足补0
    let field = params.column.key;
    let rowData = params.row;
    let value = rowData[field];
    let formatValue = commonFormat.decimalDigitsFormat(value,4);
    return h('span',formatValue);
  },decimalDigits6Format(h,params){
    //保留小数点后两位，不足补0
    let field = params.column.key;
    let rowData = params.row;
    let value = rowData[field];
    let formatValue = commonFormat.decimalDigitsFormat(value,6);
    return h('span',formatValue);
  }
}
