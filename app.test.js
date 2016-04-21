import { updateEntry, superMemo2, newEntries, dueEntries, toLearnToday, 
  getDefaultSuperMemoParameters, createEntry, createUserDB, getNextNewEntryForToday, 
  updateSuperMemoParameters, getNextDueEntryForToday, lookupEntry, saveEntry, judgeUserResponse} from './app'
import { expect } from 'chai'

describe('updateEntry', function () {
  it('should preserve id', function () {
    const e = updateEntry(entry2, false, false);
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

const USER_DB = { 
  entries: [
  {id: 2, due: new Date(2016, 1, 1), word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
  {id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
  {id: 5, due: new Date(2015, 1, 1), word: {id: 5, word: 'femme', genus: 'F', rank: 5, frequency: 1049.32}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
  ],
  data: {
    lastNew: 6,
  }
}

const entry = {
  id: 10,
  due: new Date(2016, 1, 1),
  word: {id:10, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62},
  superMemoData: {interval: 1, EF: 1.3, repetition: 1},
}

const entry2 = {
  id: 10,
  due: new Date(2016, 1, 1),
  word: {id:10, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62},
  superMemoData: {interval: 1, EF: 1.3, repetition: 1},
}

const TODAY = new Date(2017, 1, 1);

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

describe('updateSuperMemoParameters', function() {
  it('should update EF if correct = true', function() {
    const SMData = updateSuperMemoParameters(entry.superMemoData, true);
    expect(SMData).to.deep.equal({interval: 6, EF: 1.4, repetition: 2});
  });
});

describe('updateSuperMemoParameters', function() {
  it('should not update EF if correct = false', function() {
    const SMData = updateSuperMemoParameters(entry2.superMemoData, false);
    expect(SMData).to.deep.equal({interval: 1, EF: 1.3, repetition: 1});
  });
});

describe('getNextDueEntryForToday', function() {
  it('should return most due entry', function() {
    const nextDue = getNextDueEntryForToday(USER_DB);
    expect(nextDue).to.deep.equal({id: 5, due: new Date(2015, 1, 1), word: {id: 5, word: 'femme', genus: 'F', rank: 5, frequency: 1049.32}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}});
  });
});

describe('lookupEntry', function() {
  it('should return  entry', function() {
    const entry = lookupEntry(USER_DB, 3);
    expect(entry).to.deep.equal([{id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}]);
  });
});

describe('lookupEntry', function() {
  it('should return empty list', function() {
    const entry = lookupEntry(USER_DB, 10);
    expect(entry).to.deep.equal([]);
  });
});

describe('saveEntry', function() {
  it('should add new entry to the DB', function() {
    saveEntry(USER_DB, 9, {id: 9, due: new Date(2016, 1, 1), 
      word: {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6}, 
      superMemoData: {interval: 1, EF: 1.3, repetition: 1}});
    expect(USER_DB).to.deep.equal({ 
     entries: [
     {id: 2, due: new Date(2016, 1, 1), word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
     {id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
     {id: 5, due: new Date(2015, 1, 1), word: {id: 5, word: 'femme', genus: 'F', rank: 5, frequency: 1049.32}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
     {id: 9, due: new Date(2016, 1, 1), word: {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}}
     ],
     data: {
      lastNew: 9
    }
  });
  });
});

describe('saveEntry', function() {
  it('should return updated USER_DB', function() {
    saveEntry(USER_DB, 5, {id: 5, due: new Date(2016, 1, 1), 
      word: {id:5, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62}, 
      superMemoData: {interval: 1, EF: 1.3, repetition: 1}});
    expect(USER_DB).to.deep.equal({ 
     entries: [
     {id: 2, due: new Date(2016, 1, 1), word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
     {id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
     {id: 5, due: new Date(2016, 1, 1), word: {id: 5, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 9, due: new Date(2016, 1, 1), word: {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}}
     ],
     data: {
      lastNew: 9
    }
  });
  });
});

describe('judgeUserResponse', function() {
  it('should create new entry and add it to the USER_DB', function() {
    judgeUserResponse(FREQUENCIES, USER_DB, 10, 'F', true);
    var date = new Date();
    date.setDate(date.getDate() +1)
    expect(USER_DB).to.deep.equal({ 
     entries: [
     {id: 2, due: new Date(2016, 1, 1), word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
     {id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
     {id: 5, due: new Date(2016, 1, 1), word: {id: 5, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 9, due: new Date(2016, 1, 1), word: {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 10, due: date, word: {id: 10, word: 'oeil', genus: 'M', rank: 10, frequency: 413.04}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}}
     ],
     data: {
      lastNew: 10
    }
  });
  });
});

describe('judgeUserResponse', function() {
  it('should update entry in USER_DB', function() {
    judgeUserResponse(FREQUENCIES, USER_DB, 2, 'F', false);
    var date = new Date();
    date.setDate(date.getDate() +1);
    expect(USER_DB).to.deep.equal({ 
     entries: [
     {id: 2, due: date, word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 3, due: new Date(2020, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
     {id: 5, due: new Date(2016, 1, 1), word: {id: 5, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 9, due: new Date(2016, 1, 1), word: {id: 9, word: 'main', genus: 'F', rank: 9, frequency: 499.6}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}},
     {id: 10, due: date, word: {id: 10, word: 'oeil', genus: 'M', rank: 10, frequency: 413.04}, superMemoData: {interval: 1, EF: 1.3, repetition: 1}}
     ],
     data: {
      lastNew: 10
    }
    });
  });
});

