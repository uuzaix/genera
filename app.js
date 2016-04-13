import _ from 'lodash'

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

// var entry = {id: 10, word: 'rue', genus: 'F', interval: 1, repetition: 1, EF: 1.0 } 
// var answer =  {answer: 'F', sure: true, quality: 2}  // interval: 1, repetition: 1, EF: 2.0 
// var answer1 =  {answer: 'F', sure: true, quality: 4} //interval: 6, repetition: 6, EF: 2.0 
// var answer2 =  {answer: 'F', sure: true, quality: 0} //interval: 12, repetition: 6, EF: 2.0 

// console.log(superMemo2(entry, answer))
// console.log(superMemo2(entry, answer1))
// console.log(superMemo2(entry, answer2))

export function newEntries(db) {
  var newEntry = db.filter(entry => entry.due === "NEW")
  return _.orderBy(newEntry, ['frequency'], ['desc']);
}

export function dueEntries(db, today) {
   var dueEntry = db.filter(entry => (entry.due !== "NEW" && entry.due <= today));
  return _.orderBy(dueEntry, ['due'], ['asc']);
}

// TODO better name
export function toLearnToday(db, today) {
  return dueEntries(db, today).concat(newEntries(db));
}

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
  return USER_DB.entries.
    filter(function(entry) {
      return entry.due <= new Date();
  }).reduce(function(first, second) {
      if (first.due < second.due) {
        return first;
      }
      else {
        return second
      }
  });
}

export function getNextToLearnToday(USER_DB) {
  var nextDue = getNextDueEntryForToday(USER_DB);
  if (nextDue) {
    return nextDue
  }
  else{
    return getNextNewEntryForToday();
  }
}

export function lookupEntry(USER_DB, id) {
  return USER_DB.entries.filter(
    entry => entry.id === id)[0];  //TODO [0] should probably be changed
}

export function saveEntry(USER_DB, id, entry) {
  if (lookupEntry(USER_DB, id) === undefined) { 
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
  if (lookupEntry(USER_DB, id) === undefined) { 
    entry = createEntry(freqDB, id)
  }
  else {
    entry = lookupEntry(USER_DB, id) //TODO remove duplication
  }
  var correct = genus === entry.word.genus;
  saveEntry(USER_DB, id, updateEntry(entry, correct, sure));
}