#!/bin/bash

GET_WORD_CMD='curl -s -H "Content-Type: application/json"  http://127.0.0.1:4000/word'

JQ=/c/Docs/Soft/jq-win64.exe

getWord() {
    $GET_WORD_CMD
}

judge() {
    resp="{\"id\": $1, \"genus\": \"$2\", \"sure\": true}"
    echo "$resp" | curl -s -X POST -H "Content-Type: application/json" -d @- http://127.0.0.1:4000/judge
    echo
}

ask() {
    resp=$(getWord)
    id=$(echo $resp | $JQ .id)
    word=$(echo $resp | $JQ .word.word)
    echo $word
    select genus in F M; do
        judge $id $genus
        break
    done
}

while true; do
    ask
done