const assert = require('assert');
const app = require('./app.js');
const updateEntry = app.updateEntry;
const superMemo2 = app.superMemo2;
const chai = require('chai');
var expect = chai.expect;


describe('updateEntry', function() {
    it('should preserve id', function() {
        const e = updateEntry({id:10, foo: 0});
        assert.equal(10, e.id);
        expect(10).to.equal(10);
    });
}); 
