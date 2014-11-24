# ExtendMerge
=============

Yet another extend function.
Yes, I did think of crappier names, but they were all taken.
This is the same as all the other extend functions you've ever seen, with a few differences:

- there is no `extend(true,...`: extends are always deep.
- arrays are concatenated by default
- you can 'extend' strings by using `#{_}`
- you can swap sub-functions to modify how objects are treated. For example, changing the `extend.arrays` function will modify how arrays are treated; so you can, for example, keep most of the functionality, but add in your own custom array merging logic.

## Usage

`npm install --save extendmerge`

```js
var extend = require('extendmerge');
var obj = extend({},{prop:'val'},{prop:'will overwrite val'});
```

## Extending functions
The functions below are meant to be modified by the user in order to customize behaviour:

- `extend.objects(o1,o2)`: merges two objects. You are guaranteed that o1 is an object, but o2 can be anything.
- `extend.arrays(o1,o2)`: merges two arrays. You are guaranteed that o1 is an array, but o2 can be anything
- `extend.strings(o1,o2)`: merges two strings. You are guaranteed that o1 is a string, but o2 can be anything
- `extend.numbers(o1,o2)`: merges two numbers. You are guaranteed that o1 is a number, but o2 can be anything.

Additionally, you can also change the regexes used for string extension:

- `extend.regex`: is used for string extension (see below)
- `extend.populateRegex`: is used when populating an object (see below)

You also have access to the convenience library [dis](https://github.com/yelo-npm/is), available as `extend.is`.

----

## Convenience Functions

#### extend.walk(Object:obj,Function:fn)
runs the function for every node of the object. Begins deep and goes back to the root. The function has a signature of
`function(property,type,NOCHANGE){return NOCHANGE}`
where `property` is the value, `type` is the property type (string, array...), and `NOCHANGE` is a constant that you *must* return if you don't want to change the object.

#### get([String|Array]:path,Object:obj[,String:delimiter])
Gets a property of the provided object `obj` by path. Path delimiter defaults to '.', but you can set it to something else if you'd like. You can also pass an array, in which case the delimiter is not used.  
You can also use '\*' and '\*\*' to be more vague in the path resolution.  
so for the object:
```js
    var obj = {
        a:{
            b:{
                c:{
                    d:'text'
                }
            }
        }
    }

    //valid paths:
    extend.get('a.b.c.d',obj);
    extend.get('*.*.*.d',obj);
    extend.get('**.d',obj)
```

If there is more than one `d` key, you would get the first one found.

#### populate(obj)
will replace all text instances like so `#{a.b.c.d}` with the closest value that can be found; Globbing works here too.

----

#### Testing

Do check out the tests, they explain much better than this document can.

`npm install mocha chai`  

then, run `mocha` in the main dir.

----

## License
MIT