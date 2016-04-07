import _ from 'lodash'

// export function updateEntry(entry, answer) {
//   if (entry.due === 'NEW') {
//     if (entry.genus === answer.answer) {
//       if (answer.sure === true) {
//         entry.due = TODAY + 365;
//         //EF?
//         //interval?
//       }
//       else {
//         entry.due = TODAY + 7;
//         //EF?
//         //interval?
//       }
//     }
//     else {
//       entry.due = TODAY + 1;
//       //EF?
//       //interval?
//       //superMemo initialise
//     }
//     entry.repetition = 1;
//     return entry
//   }
//   else {
//     return superMemo2(entry, answer);
//   }
// }

export function superMemo2(entry, answer) {
  // if (answer.quality < 2 || answer.quality > 5) {
  //  throw "Quality should be between 2 and 5";
  // }

  //calculate repetition and EF based on answer.quality. 
  if(answer.quality == 2){
    entry.repetition = 1 //proceed as a new word without updating the EF
  }
  else {
    entry.EF = entry.EF + (0.1 - (5-answer.quality)*(0.08+(5-answer.quality)*0.02)) //calculate new EF
    entry.repetition += 1
  }


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

export function getDefaultSupermemoParameters(correct, sure) {
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
  var newEntry = freqDB.filter(function(entry) {
    return entry.id == id
  });
  return {id: id, due: 'NEW', word: newEntry[0]}
}

export function createUserDB() {
  return {entries: [], data: {lastNew: 0}}
}

//freqDB - pass to func or be in the global scope?
export function getNextNewEntryForToday(freqDB, USER_DB) {
  return createEntry(freqDB, (USER_DB.data.lastNew + 1))
}
