import { updateEntry, superMemo2, newEntries, dueEntries, toLearnToday, getDefaultSuperMemoParameters, createEntry, createUserDB, getNextNewEntryForToday} from './app'
import { expect } from 'chai'

describe('updateEntry', function () {
    it('should preserve id', function () {
        const e = updateEntry({id: 10, foo: 0});
        expect(e.id).to.equal(10);
    });
});

describe('superMemo2', function () {
    it('should update interval and repetition to 1 when quality is 2', function () {
        const quality2 = superMemo2({interval: 5, repetition: 5, EF: 2.0}, 2);
        expect(quality2.interval).to.equal(1);
        expect(quality2.repetition).to.equal(1);
        expect(quality2.EF).to.equal(2.0);
    });
    it('should calculate correct values', function () {
        const quality4 = superMemo2({interval: 5, repetition: 5, EF: 2.0}, 4);
        expect(quality4.interval).to.equal(10);
        expect(quality4.repetition).to.equal(6);
        expect(quality4.EF).to.equal(2.0);
        const quality5 = superMemo2({interval: 1, repetition: 1, EF: 1.0}, 5);
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
    {id: 1, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62},
    {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55},
    {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92},
    {id: 4, word: 'temps', genus: 'M', rank: 4, frequency: 1031.05},
    {id: 5, word: 'femme', genus: 'F', rank: 5, frequency: 1049.32},
    {id: 6, word: 'fois', genus: 'F', rank: 6, frequency: 899.25},
    {id: 7, word: 'peu', genus: 'M', rank: 7, frequency: 894.78},
    {id: 8, word: 'vie', genus: 'F', rank: 8, frequency: 1021.22},
    {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6},
    {id: 10, word: 'oeil', genus: 'M', rank: 10, frequency: 413.04},
]

const DB = [
{id: 1, due: 'NEW', frequency: 4},
{id: 2, due: new Date(2016, 1, 1), frequency: 2},
{id: 3, due: new Date(2020, 1, 1), frequency: 3},
{id: 4, due: 'NEW', frequency: 5},
{id: 5, due: new Date(2015, 1, 1), frequency: 1}
]

const USER_DB = { 
   entries: [
      {id: 2, due: new Date(2016, 1, 1), word: {word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {}},
      {id: 3, due: new Date(2020, 1, 1), word: {word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {}}, 
      {id: 5, due: new Date(2015, 1, 1), word: {word: 'femme', genus: 'F', rank: 5, frequency: 1049.32}, superMemoData: {}}
    ],
    data: {
      lastNew: 6     
    }
}

const entry = {
 id: 10,
 due: new Date(2016, 1, 1),
 word: {id:10, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62},
 superMemoData: {interval: 1, EF: 1.3, repetition: 1},
}


const TODAY = new Date(2017, 1, 1);

describe('newEntries', function () {
    it('should return all new entries in order of frequency', function () {
        const entries = newEntries(DB);
        const ids = entries.map(e => e.id);
        expect(ids).to.deep.equal([4, 1]);
    });
});

describe('dueEntries', function() {
    it('should return all due entries, most due first', function() {
        const entries = dueEntries(DB, TODAY);
        const ids = entries.map(e => e.id);
        expect(ids).to.deep.equal([5, 2]);
    });
});

describe('toLearnToday', function() {
    it('should return all due entries, then all new entries', function() {
        const entries = toLearnToday(DB, TODAY);
        const ids = entries.map(e => e.id);
        expect(ids).to.deep.equal([5, 2, 4, 1]);
    });
});

describe('getDefaultSuperMemoParameters', function() {
    it('should return correct SM data', function() {
        const correctEasyWord = getDefaultSuperMemoParameters(true, true);
        const incorrectEasyWord = getDefaultSuperMemoParameters(false, true);
        const incorrectHardWord = getDefaultSuperMemoParameters(false, true);
        const correctHardWord = getDefaultSuperMemoParameters(true, false);
        expect(correctEasyWord).to.deep.equal({interval: 100, EF: 2.5, repetition: 1});
        expect(incorrectEasyWord).to.deep.equal({interval: 1, EF: 1.3, repetition: 1});
        expect(incorrectHardWord).to.deep.equal({interval: 1, EF: 1.3, repetition: 1});
        expect(correctHardWord).to.deep.equal({interval: 7, EF: 2.5, repetition: 1});
    });
});

describe('createEntry', function() {
    it('should return new entry from FREQUENCIES', function() {
        const newEntry = createEntry(FREQUENCIES, 7);
        expect(newEntry).to.deep.equal({id: 7, due: 'NEW', word: {id: 7, word: 'peu', genus: 'M', rank: 7, frequency: 894.78}});
    });
});

describe('createUserDB', function() {
    it('should return new empty DB', function() {
        const newUserDB = createUserDB();
        expect(newUserDB).to.deep.equal({entries: [], data: {lastNew: 0}});
    });
});

describe('getNextNewEntryForToday', function() {
    it('should return next new entry form FREQUENCIES', function() {
        const nextNewEntry = getNextNewEntryForToday(FREQUENCIES, USER_DB);
        expect(nextNewEntry).to.deep.equal({id: 7, due: 'NEW', word: {id: 7, word: 'peu', genus: 'M', rank: 7, frequency: 894.78}});
    });
});

