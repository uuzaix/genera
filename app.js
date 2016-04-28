import _ from 'lodash'

import 'express'

var express = require('express');
var app = express();

var USER_DB = { 
   entries: [
      {id: 1, due: new Date(2016, 1, 1), word: {id: 1, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
      {id: 2, due: new Date(2020, 1, 1), word: {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}}, 
      {id: 3, due: new Date(2015, 1, 1), word: {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92}, superMemoData: {interval: 1, EF: 1.3, repetition: 2}},
      ],
    data: {
      lastNew: 3,
    }
}

var FREQUENCIES = [
    {id: 1, word: 'chose', genus: 'F', rank: 1, frequency: 1773.62},
    {id: 2, word: 'homme', genus: 'M', rank: 2, frequency: 1123.55},
    {id: 3, word: 'jour', genus: 'M', rank: 3, frequency: 1061.92},
    {id: 4, word: 'temps', genus: 'M', rank: 4, frequency: 1031.05},
    {id: 5, word: 'femme', genus: 'F', rank: 5, frequency: 1049.32},
    {id: 6, word: 'fois', genus: 'F', rank: 6, frequency: 899.25},
    {id: 7, word: 'peu', genus: 'M', rank: 7, frequency: 894.78},
    {id: 8, word: 'vie', genus: 'F', rank: 8, frequency: 1021.22},
    {id: 9, word: 'oeil', genus: 'M', rank: 10, frequency: 413.04},
    {id: 10, word: 'main', genus: 'F', rank: 9, frequency: 499.6},
]

export function superMemo2(entry, quality) {
  // if (answer.quality < 2 || answer.quality > 5) {
  //  throw "Quality should be between 2 and 5";
  // }

  //calculate repetition and EF based on answer.quality. 
  if(quality == 2){
    entry.repetition = 1 //proceed as a new word without updating the EF
  }
  else {
    entry.EF = Math.round((entry.EF + (0.1 - (5-quality)*(0.08+(5-quality)*0.02)))*10)/10 //calculate new EF
    if (entry.EF > 2.5) {
      entry.EF = 2.5
    }
    entry.repetition += 1
  }

//calculetes interval of repetition
  if(entry.repetition == 1) {
    entry.interval = 1
  }
  else if(entry.repetition == 2){
    entry.interval = 6
  }
  else {
    entry.interval = Math.round(entry.interval*entry.EF)
  }

  return entry
}

//OUTDATED
// export function newEntries(db) {
//   var newEntry = db.filter(entry => entry.due === "NEW")
//   return _.orderBy(newEntry, ['frequency'], ['desc']);
// }

// export function dueEntries(db, today) {
//    var dueEntry = db.filter(entry => (entry.due !== "NEW" && entry.due <= today));
//   return _.orderBy(dueEntry, ['due'], ['asc']);
// }

// // TODO better name
// export function toLearnToday(db, today) {
//   return dueEntries(db, today).concat(newEntries(db));
// }

export function getDefaultSuperMemoParameters(correct, sure) {
  if (correct === true && sure === true) {
    return {interval: 100, EF: 2.5, repetition: 1}
  }
  else if (correct === true && sure === false) {
    return {interval: 7, EF: 2.5, repetition: 1}
  }
  else {
    return {interval: 1, EF: 1.3, repetition: 1}
  }
}

//freqDB - pass to func or be in the global scope?
export function createEntry(freqDB, id) {
  var newEntry = freqDB.filter(
    entry => entry.id === id
  );
  return {id: id, due: 'NEW', word: newEntry[0]}
}

export function createUserDB() {
  return {entries: [], data: {lastNew: 0}}
}

//freqDB - pass to func or be in the global scope?
export function getNextNewEntryForToday(freqDB, USER_DB) {
  return createEntry(freqDB, (USER_DB.data.lastNew + 1))
}

export function updateEntry(entry, correct, sure) {
  if (entry.due === 'NEW') {
    entry.superMemoData = getDefaultSuperMemoParameters(correct, sure);
  }
  else {
    entry.superMemoData = updateSuperMemoParameters(entry.superMemoData, correct)
  }
  entry.due = new Date(); 
  entry.due.setDate(entry.due.getDate() + entry.superMemoData.interval);
  return entry
}

export function updateSuperMemoParameters(data, correct) {
  var quality = correct ? 5 : 2;
  return superMemo2(data, quality);
}

export function getNextDueEntryForToday(USER_DB) {
  var returnEntries = USER_DB.entries.
  filter(function(entry) {
    return entry.due <= new Date();
  });
  if (_.isEmpty(returnEntries)) {
    return returnEntries
  }
  else {
    return returnEntries.reduce(function(first, second) {
      if (first.due < second.due) {
        return first;
      }
      else {
        return second;
      }
    });
  }
}

export function getNextToLearnToday(USER_DB) {
  var nextDue = getNextDueEntryForToday(USER_DB);
  if (!(_.isEmpty(nextDue))) {
    return nextDue;
  }
  else {
    return getNextNewEntryForToday(FREQUENCIES, USER_DB); //to fix 
  }
}

export function lookupEntry(USER_DB, id) {
  return USER_DB.entries.filter(
    entry => entry.id === id);
}

export function saveEntry(USER_DB, id, entry) {
  if (_.isEmpty(lookupEntry(USER_DB, id))) { 
    USER_DB.entries.push(entry);
    USER_DB.data.lastNew = id;
  }
  else {
    USER_DB.entries.map(function(DBentry) {
      if (DBentry.id === id) {
        DBentry.due = entry.due;
        DBentry.word = entry.word;
        DBentry.superMemoData = entry.superMemoData;
      }
    });
  }
}

export function judgeUserResponse(freqDB, USER_DB, id, genus, sure) {
  var entry;
  var entryList = lookupEntry(USER_DB, id);
  if (_.isEmpty(entryList)) { 
    entry = createEntry(freqDB, id)
  }
  else {
    entry = entryList[0];
  }
  var correct = genus === entry.word.genus;
  saveEntry(USER_DB, id, updateEntry(entry, correct, sure));
  return correct;
}

// app.get('/getNext', function (req, res) {
//   res.send(getNextToLearnToday(USER_DB));
//   judgeUserResponse(FREQUENCIES, USER_DB, getNextToLearnToday(USER_DB).id, getNextToLearnToday(USER_DB).word.genus, true)}
// );

// app.get('/checkOne', function (req, res) {
//   res.send(lookupEntry(USER_DB, 3));
//   judgeUserResponse(FREQUENCIES, USER_DB, 3, 'M', true)
// });

var path = require('path');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/word', function (req, res) {
  res.send(getNextToLearnToday(USER_DB));
});

app.post('/word', function (req, res, next) {
  const correct = judgeUserResponse(FREQUENCIES, USER_DB, req.body.id, req.body.genus, req.body.sure);
  console.log(USER_DB); 
  res.send(correct);
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!');
});
