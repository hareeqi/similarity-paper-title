
const fs = require('fs')
const alg = {
  levenshtein  : require("similarity"),
  dice  : require('string-similarity').compareTwoStrings
}

let result = ''
const log= (text)=>{
  console.log(text);
  result+=(text+'\n')
}

const args = process.argv
const threshold = args[3]? Number(args[3]) : 0.9
const algorthim_name = args[4] === 'levenshtein' ? 'levenshtein' :'dice'
const compare = alg[algorthim_name]
const list  = fs.readFileSync(args[2],{encoding:'utf8'}).split('\n')

let total_match = 0

let found = {}
for (let i = 0 ; i < list.length ; i++)
  found[i]={}

log(`\n\n\nStarting the scan using ${algorthim_name} algorthim\n\n\n`);
const start_time = Date.now()

for (let i = 0 ; i < list.length ; i++) {
  for (let j = 0 ; j < list.length ; j++) {
    if (i !== j && !found[i][j] && !found[j][i] ){
      let score = compare(list[i],list[j])
      if(score > threshold ){
        total_match++
        found[i][j]=true
        log(`Line ${i+1} : ${list[i]}`)
        log(`Line ${j+1} : ${list[j]}`)
        log(`Score: ${score*100}`);
        log('==================');
      }
    }
  }
}

log(`\n\n\nTotal Match: ${total_match}`);
log(`Time Taken: ${(Date.now()-start_time)/1000/60} minutes'`);
log(`Algorithem used ${algorthim_name}`);
log(`Threshold used ${threshold*100} %`);
log(`Total records ${list.length} \n\n\n`);
fs.writeFileSync(`result_${algorthim_name}.txt`,result)
