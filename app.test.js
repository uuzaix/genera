import { updateEntry, superMemo2 } from './app'
import { expect } from 'chai'

describe('updateEntry', function () {
    it('should preserve id', function () {
        const e = updateEntry({id: 10, foo: 0});
        expect(e.id).to.equal(10);
    });
});

describe('superMemo2', function () {
    it('should update interval and repetition to 1 when quality is 2', function () {
        const quality2 = superMemo2({interval: 5, repetition: 5, EF: 2.0}, {quality: 2});
        expect(quality2.interval).to.equal(1);
        expect(quality2.repetition).to.equal(1);
        expect(quality2.EF).to.equal(2.0);
    });
    it('should calculate correct values', function () {
        const quality4 = superMemo2({interval: 5, repetition: 5, EF: 2.0}, {quality: 4});
        expect(quality4.interval).to.equal(10);
        expect(quality4.repetition).to.equal(6);
        expect(quality4.EF).to.equal(2.0);
        const quality5 = superMemo2({interval: 1, repetition: 1, EF: 1.0}, {quality: 5});
        expect(quality5.interval).to.equal(6);
        expect(quality5.repetition).to.equal(2);
        expect(quality5.EF).to.equal(1.1);
    });
    // it('should check if quality is between 2 and 5', function() {
    //     const quality0 = superMemo2({interval: 5, repetition: 5, EF: 2.0 }, {quality: 1});
    //     assert.throws(quality0, Error, "Quality should be between 2 and 5");
    // });
});

const FREQUENCIES = [
    {word: 'chose', genus: 'F', rank: 1 frequency: 1773.62},
    {word: 'homme', genus: 'M', rank: 2, frequency: 1123.55},
    {word: 'jour', genus: 'M', rank: 3, frequency: 1061.92},
    {word: 'temps', genus: 'M', rank: 4, frequency: 1031.05},
    {word: 'femme', genus: 'F', rank: 5, frequency: 1049.32},
    {word: 'fois', genus: 'F', rank: 6, frequency: 899.25},
    {word: 'peu', genus: 'M', rank: 7, frequency: 894.78},
    {word: 'vie', genus: 'F', rank: 8, frequency: 1021.22},
    {word: 'main', genus: 'F', rank: 9, frequency: 499.6},
    {word: 'oeil', genus: 'M', rank: 10, frequency: 413.04},
]

describe('nextEntry', function () {
    const db = [
        {id: 1, due: 'NEW'},
        {id: 2, due: new Date(2016, 1, 1)}
        {id: 3, due: new Date(2017, 1, 1)}
        {id: 4, due: 'NEW'}
    ]
    it('should return all new entries', function () {

    })
});