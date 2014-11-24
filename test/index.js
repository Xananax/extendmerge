var chai = require('chai')
var expect = chai.expect
var extend = require('../index.js');
chai.should();

describe('extending objects',function(){
	it('should merge two objects',function(){
		var a = {a:'a'}
		,	b = {b:'b'}
		,	c = extend(a,b)
		;
		c.should.have.property('a');
		c.a.should.equal(a.a);
	});
	it('should not modify the original objects',function(){
		var a = {a:{aa:'aa'}}
		,	b = {b:{bb:'bb'}}
		,	c = extend({},a,b)
		;
		c.a = 'c';
		a.a.should.not.equal('c');
	});
	it('should append arrays',function(){
		var a = {a:[1,2,3,4]}
		,	b = {a:[5,6,7,8]}
		,	c = extend({},a,b)
		;
		c.a.should.eql([1,2,3,4,5,6,7,8]);
	});
	it('should extend strings when using #{_}',function(){
		var a = {a:'a'}
		,	b = {a:'b #{_} #{_}'}
		,	c = extend({},a,b)
		;
		c.a.should.equal('b a a');
	});
	it('should work with functions',function(){
		var func = function(){return 'a';}
		,	a = {a:{a:func}}
		,	b = extend({},a);
		b.a.should.have.property('a');
		b.a.a().should.equal('a');
	});
	it('should allow to swap functions',function(){
		var oldExtendArrays = extend.arrays;
		extend.arrays = function(obj1,obj2){
			return ['your mom'];
		}
		var a = {a:[1,2,3,4]}
		,	b = {a:[5,6,7,8]}
		,	c = extend({},a,b)
		;
		c.a.should.eql(['your mom']);
		extend.arrays = oldExtendArrays;
	});
	it('should allow for deep merges of complex objects',function(){
		var obj1 = {
			a:{
				aa:{
					aaa:'aaa'
				,	aab:123
				}
			,	ab:['aba','abb','abc']
			}
		,	b:{
				ba:[]
			,	bb:'bb'
			,	bc:{
					bca:{}
				,	bcb:{
						bcba:['bcba1','bcba2','bcba3','bcba4',{prop:'value'}]
					,	bcbb:['bcbb1','bcbb2']
					,	bcbc:['bcbc1','bcbc2']
					}
				}
			}
		};
		var obj2 = {
			a:{
				aa:{
					aaa:'obj2aaa'
				,	aab:456
				}
			,	ab:['obj2aba','obj2abb','obj2abc']
			}
		,	b:{
				ba:['obj2A','obj2B']
			,	bb:'obj2bb'
			,	bc:{
					bca:{}
				,	bcb:{
						bcba:['obj2bcba1','obj2bcba2']
					}
				}
			}
		};
		var obj3 = extend({},obj1,obj2);
	})
});
describe('manipulating objects',function(){
	describe('#walk',function(){
		it('should walk objects',function(){
			var obj = {text:'c',a:{b:{c:{d:'e'}}}};
			extend.walk(obj,function(obj,type,NOCHANGE){
				if(type=='string'){return obj+'!'}
				return NOCHANGE;
			});
			obj.text.should.equal('c!')
		});
		it('should render the object undefined if NOCHANGE is not returned',function(){
			var obj = {text:'c',a:{b:{c:{d:'e'}}}};
			extend.walk(obj,function(obj,type,NOCHANGE){});
			expect(obj.text).to.be.undefined;
		});
	});
	describe('#populate',function(){
		it('should allow to replace strings by using #{[variable]}',function(){
			var a = {a:{b:{c:'text'}}}
			,	b = {text:'#{a.b.c}'}
			,	c = extend({},a,b);
			;
			extend.populate(c);
			c.text.should.equal('text');
		});
	});
	describe('#get',function(){
		it('should allow to access objects by path',function(){
			var obj = {a:{b:{c:'a'}}};
			var val = extend.get('a/b/c',obj,'/');
			val.should.equal('a');
		});
		it('should allow a basic form of globbing',function(){
			var obj = {text:'#{**.f}',a:{b:{c:{d:{e:{f:'g'}}}}}};
			var val = extend.get('**.f',obj);
			extend.populate(obj);
			val.should.equal('g');
			obj.text.should.equal('g');
		})
	});
})