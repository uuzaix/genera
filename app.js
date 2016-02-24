export function updateEntry(entry, answer) {
    return entry;
}

export function superMemo2(entry, answer) {
	// if (answer.quality < 2 || answer.quality > 5) {
	// 	throw "Quality should be between 2 and 5";
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
