(function (name, root, factory){
	if(typeof module === 'object' && typeof module.exports === 'object'){
		module.exports = factory(require('dis'));
		return;
	}
	if (typeof define === 'function' && define.amd){
		define(['dis'], factory);
		return;
	}
	root[name] = factory(root.is);
})('extend',this,function(is){

	if(!is){throw new Error('module `dis` is required for extend to work properly');}
	var undef;

	function extend(){
		var i =0
		,	l = arguments.length
		,	obj1 = arguments[0]
		,	obj2
		;
		if(!l){return false;}
		if(l==1){return arguments[0];}
		while(i++<l){
			obj2 = arguments[i];
			if(!is.defined(obj2)){continue;}
			if(!is.defined(obj1)){
				return is.array(obj2) ?
					extend([],obj2)
				:
					is.object(obj2) ?
						extend({},obj2)
					:
						obj2
				;
			}
			else if(is.object(obj1)){
				obj1 = extend.objects(obj1,obj2);
			}
			else if(is.array(obj1)){
				obj1 = extend.arrays(obj1,obj2);
			}
			else if(is.string(obj1)){
				obj1 = extend.strings(obj1,obj2);
			}
			else if(is.number(obj1)){
				obj1 = extend.numbers(obj1,obj2);
			}
			else{
				obj1 = obj2;
			}
		}
		return obj1;
	}

	function extend_objects(obj1,obj2){
		if(is.empty(obj2)){return obj1;}
		var name,src,copy;
		if(!is.array(obj2) && !is.object(obj2)){
			return obj2;
		}
		for(name in obj2){
			src = obj1[name];
			copy = obj2[name];
			if(obj1 === copy || !is.defined(copy)){continue;}
			if(!is.defined(src)){
				src = is.array(copy)?[]:is.object(copy)?{}:undef;
			}
			obj1[name] = extend(src,copy);
		}
		return obj1;
	}

	function extend_arrays(obj1,obj2){
		if(is.empty(obj2)){return extend([],obj1);}
		var name,src,copy,isArray = is.array(obj2);
		if(!isArray && !is.object(obj2)){
			obj1.push(obj2);
			return obj1;
		}
		for(name in obj2){
			src = obj1[name];
			copy = obj2[name];
			if(obj1 === copy || !is.defined(copy)){continue;}
			if(!is.defined(src)){
				src = is.array(copy)?[]:is.object(copy)?{}:undef;
			}
			if(!isArray && is.numeric(name)){
				obj1[name] = extend(src,copy);
			}else{
				obj1.push(extend(src,copy));
			}
		}
		return obj1;
	}

	function extend_strings(obj1,obj2){
		if(!is.string(obj2)){obj2 = obj2+'';}
		if(extend.regex.test(obj2)){
			obj1 = obj2.replace(extend.regex,obj1);
		}
		else{
			obj1 = obj2;
		}
		return obj1;
	}

	function extend_numbers(obj1,obj2){
		return obj2;
	}

	function extend_walk(obj,fn){
		var n, prop,NOCHANGE={},ret;
		if(!is.array(obj) && !is.object(obj)){throw new Error('walk only works on objects or arrays');}
		for(n in obj){
			prop = obj[n];
			if(is.array(prop) || is.object(prop)){
				extend.walk(prop,fn);
			}
			ret = fn(prop,is(prop),NOCHANGE);
			if(ret!==NOCHANGE){
				obj[n] = ret;
			}
		}
	}

	function extend_getKey(key, obj, delimiter){
		if(!obj){throw new Error('no object provided to get key from');}
		if(key.match(/\*/)){
			return extend.getGlob(key,obj,delimiter);
		}
		delimiter = delimiter || '.';
		if(!is.array(key)){
			key = key.split(delimiter);
		}
		return key.reduce(extend_getKey_reduce,obj);
	}

	function extend_getKeyComplex(key,obj,delimiter){
		if(!key){return obj;}
		if(!is.array(key)){key = key.split(delimiter||'.');}
		if(!key.length){return obj;}
		if(!is.array(obj) && !is.object(obj)){return undef;}
		var currentPath = key.shift();
		if(!currentPath.match(/\*/)){
			if(!obj.hasOwnProperty(currentPath)){return undef;}
			return extend.getGlob(key,obj[currentPath]);
		}
		var ret = [],temp,n,tempKey;
		for(n in obj){
			if(!obj.hasOwnProperty(n)){continue;}
			temp = extend.getGlob(key.slice(),obj[n]);
			if(typeof temp !== 'undefined'){
				ret.push(temp);
			}else if(currentPath=='**'){
				tempKey = key.slice();
				tempKey.unshift('**');
				temp = extend.getGlob(tempKey,obj[n]);
				if(typeof temp !== 'undefined'){
					ret.push(temp);
				}
			}
		}
		if(!ret.length){return undef;}
		return ret[0];
	}

	function extend_getKey_reduce(a,b){
		return a && a[b];
	}

	function extend_populate(obj){
		var text,key,match;
		extend.walk(obj,function(prop,type,NOCHANGE){
			if(type=='string'){
				if(extend.populateRegex.test(prop)){
					match = extend.populateRegex.exec(prop);
					while (match !== null) {
						text = match[0];
						key = match[1];
						val = extend.get(key,obj) || '';
						prop = prop.replace(text,val);
						match = extend.populateRegex.exec(prop);
					}
					return prop;
				}
			}
			return NOCHANGE;
		});
	}

	extend.objects = extend_objects;
	extend.arrays = extend_arrays;
	extend.strings = extend_strings;
	extend.numbers = extend_numbers;
	extend.regex = /#{\s*?_\s*?}/g;
	extend.populateRegex = /#{\s*?(.+?)\s*?}/;
	extend.walk = extend_walk;
	extend.get = extend_getKey;
	extend.getGlob = extend_getKeyComplex;
	extend.populate = extend_populate;
	extend.is = is;

	return extend;
});