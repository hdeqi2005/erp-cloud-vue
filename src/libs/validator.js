import request from './request'
let rules = {
  success(){
    return {success:true};
  },fail(msg){
    return {success:false,message:msg?msg:''};
  },required(value,fieldDesc){
			if(value && value != null && value.trim() != ''){
				return this.success();
			}
			//return this.fail('不能为空');
			return this.fail(`${fieldDesc}不能为空`);
		},number(value,fieldDesc){
			if(isNaN(Number(value))){
        return this.fail(`${fieldDesc}必须是数字`);
			}
			return this.success();
		},integer(value,fieldDesc){
			if(/\d+/.test(value)){
				return this.success();
			}
       return this.fail(`${fieldDesc}必须是整数`);
		},double(value){

		},identifier(value,fieldDesc){//编号
			if(/^[\w#\-+=\\/]*$/gi.test(value.trim())){
				return this.success();
			}
      return this.fail(`${fieldDesc}只能是字母、数字、下划线、#\\-+=/`);
		},email(value,fieldName){
			if(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value.trim())){
				return this.success();
			}
      return this.fail(`${fieldDesc}邮箱输入有误`);
		},date(value,fieldDesc){
			if(value instanceof Date){
				return this.success();
			}
			let re = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/.test(value.trim());
			if(re){
				return this.success();
			}
      return this.fail(`${fieldDesc}日期格式有误`);
		},time(value,fieldDesc){
			let re = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(value.trim());
			if(re){
				return this.success();
			}
      return this.fail(`${fieldDesc}时间格式有误`);
		},datetime(value,fieldDesc){
			if(value instanceof Date){
				return this.success();
			}
			let re = /^[\d]{4}-[\d]{1,2}-[\d]{1,2}\s*[\d]{1,2}:[\d]{1,2}:[\d]{1,2}|[\d]{4}-[\d]{1,2}-[\d]{1,2}|[\d]{1,2}:[\d]{1,2}:[\d]{1,2}$/g
					.test(value.trim());
			if(re){
				return this.success();
			}
       return this.fail(`${fieldDesc}日期时间格式有误`);
		},mustNumberEqualLength(value,length,fieldDesc){
      if(/\d+/.test(value) && value.length == length){
      				return this.success();
      }
      return this.fail(`${fieldDesc}必须是整数且长度必须等于${length}位`);
    },mustDouble(value,fieldDesc){
      if(/^(([1-9][0-9]*(,\d{3})+?|0|[1-9][0-9]{0,9})(\.\d{1,6})?)$/.test(value)){
      		return this.success();
      }
        return this.fail(`${fieldDesc}须为正数且整数位不超过10，小数位不超过6`);
    },toCDB(value,fieldDesc){
			if(value!=null && value!='' && value.match(/[\uff00-\uffff]/g)){
        return this.fail(`${fieldDesc}不能输入非法字符`);
			}
			return this.success();
		},spaceStr(value,fieldDesc){
			if(/^[^\s]+$/.test(value)){
        return this.success();
      }
      return this.fail(`${fieldDesc}不能输入空格`);
		},isChinse(value,fieldDesc){
			if(!/^[\u4e00-\u9fa5]{2,6}$/.test(value)){
				return this.fail(`${fieldDesc}只能输入中文`)
			}else{
				return true
			}
		},phone(value,fieldDesc){
			if(/^1[3|4|5|7|8][0-9]{9}$/.test(value)){//电话号码校验
				return true
			}else{
				return this.fail(`${fieldDesc}请输入正确的电话号码`)
			}
		},leng(value,fieldDesc){
			if(/^[A-Za-z]+$/.test(value)){
				return true
			}else{
				return this.fail(`${fieldDesc}只能是字母`)
			}
		}

}

/**
 * 数据是否存在
 * @param {Object} rule
 * @param {Object} value
 * @param {Object} callback
 */
export const existsValidator = function(rule, value, callback){
  let data = Object.assign({},rule.params);
  let keys = Object.keys(data);
  let requestData = {};
  keys.forEach(key => {
    let value = data[key];
    if(typeof value === 'function'){
  	  value = value();
    }
    requestData[key] = value;
  });
  
  let submitData = {
    formName : requestData.formName,
    id:requestData.id
  };
  delete requestData.formName;
  delete requestData.id;
  let params = {};
  params[requestData.fieldName] = value;
  delete requestData.fieldName;
  submitData['params'] = Object.assign(params,requestData);
  let fieldDesc = rule.fieldDesc;
  request.post('/sys/form/validator/exists',submitData).then(res=>{
    if(res){
      callback();
    }else{
	  callback(`${fieldDesc}数据不存在`);
    }
  }).catch(()=>{
    callback(`${fieldDesc}校验失败`);
  })
}

/**唯一校验
 * @param {Object} rule
 * @param {Object} value
 * @param {Object} callback
 *
 * submitData:{
   formName;
  id;
  params;
 }
 *
 */
export const uniqueValidator = function(rule, value, callback){
  let data = Object.assign({},rule.params);
  let keys = Object.keys(data);
  let requestData = {};
  keys.forEach(key => {
    let value = data[key];
    if(typeof value === 'function'){
  	  value = value();
    }
    requestData[key] = value;
  });

  let submitData = {
    formName : requestData.formName,
    id:requestData.id
  };
  delete requestData.formName;
  delete requestData.id;
  let params = {};
  params[requestData.fieldName] = value;
  delete requestData.fieldName;
  submitData['params'] = Object.assign(params,requestData);
  let fieldDesc = rule.fieldDesc;
  request.post('/sys/form/validator/unique',submitData).then(res=>{
    if(res){
		//debugger
      callback();
    }else{
	  callback(`${fieldDesc}数据已经存在`);
	  //debugger
    }
  }).catch(()=>{

    callback(`${fieldDesc}校验失败`);
  })

}

export const customValidator = function(rule, value, callback){
	// 自定义验证
  //debugger;
	let validatorResult = false;
	if(rule.customRule){
		for(let i = 0;i < rule.customRule.length;i++){
			let result = rules[rule.customRule[i]](value,rule.fieldDesc,rule);
      if(!result.success){
        callback(result.message);
        return;
      }
		}
	}
 callback();
}
