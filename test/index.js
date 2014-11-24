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