global.window = { Backbone: require('backbone') }

var BaseModel = require('../')
  , schemata = require('schemata')

describe('BaseModel', function () {

  describe('toJSON()', function () {

    it('should deep clone attributes', function () {

      var model = new BaseModel(
        { name: 'Cabal'
        , type: 'Superhero'
        , skills: [ 'flying', 'x-ray vision' ]
        , specialItems:
          { cape: { type: 'tool', health: '10' }
          , sword: { type: 'weapon', damage: '10' }
          }
        })

      var before = model.toJSON()
        , modified = model.get('specialItems')

      modified.cape.health = 20
      modified.sword.damage = 15
      model.set('specialItems', modified)

      var after = model.toJSON()

      after.should.not.eql(before)

    })

    it('should call toJSON() on any attributes that are models', function () {

      var model = new BaseModel(
        { a: 10
        , b: 20
        , subModel: new BaseModel({ c: 30, d: 40 })
        })

      model.toJSON().subModel.should.eql({ c: 30, d: 40 })

    })

  })

  describe('parse()', function () {

    it('should coerce string -> Date for properties of type Date', function () {

      var TestModel = BaseModel.extend(
        { schemata: schemata({ date: { type: Date }})
        })

      var testModel = new TestModel()
        , jsonData = [ JSON.stringify({ date: new Date() }), JSON.stringify({ results: { date: new Date() } }) ]
        , parsed = [ testModel.parse(JSON.parse(jsonData[0])), testModel.parse(JSON.parse(jsonData[1])) ]

      parsed[0].date.should.be.instanceOf(Date)
      parsed[0].date.should.be.instanceOf(Date)

    })

  })

})