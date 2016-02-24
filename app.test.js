import { updateEntry, superMemo2 } from './app'
import { expect } from 'chai'

describe('updateEntry', function() {
    it('should preserve id', function() {
        const e = updateEntry({id:10, foo: 0});
        expect(e.id).to.equal(10);
    });
}); 

describe('superMemo2', function() {
    it('should update interval and repetition to 1 when quality is 2', function() {
        const quality2 = superMemo2({interval: 5, repetition: 5, EF: 2.0 }, {quality: 2});
        expect(quality2.interval).to.equal(1);
        expect(quality2.repetition).to.equal(1);
        expect(quality2.EF).to.equal(2.0);
    });
    it('should calculate correct values', function() {
        const quality4 = superMemo2({interval: 5, repetition: 5, EF: 2.0 }, {quality: 4});
        expect(quality4.interval).to.equal(10);
        expect(quality4.repetition).to.equal(6);
        expect(quality4.EF).to.equal(2.0);
        const quality5 = superMemo2({interval: 1, repetition: 1, EF: 1.0 }, {quality: 5});
        expect(quality5.interval).to.equal(6);
        expect(quality5.repetition).to.equal(2);
        expect(quality5.EF).to.equal(1.1);
    });
    // it('should check if quality is between 2 and 5', function() {
    //     const quality0 = superMemo2({interval: 5, repetition: 5, EF: 2.0 }, {quality: 1});
    //     assert.throws(quality0, Error, "Quality should be between 2 and 5");
    // });
}); 
