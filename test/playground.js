
//Verbos
/*var x = [[0, 1], [2, 3], [4, 5]].reduce((acc, item,index) => {
  const flatten = acc.concat(item);
  acc[index] = flatten;
  console.log(acc)
  return flatten;
});*/

//console.log(x)

function getDividedProblem(){
  return [1, 1, 1, 1, 1];
}
function invokeComputationLambda(x){
  return Promise.resolve(x*2)
}

var results = []
var answers = []

var dataPieces = getDivideProblem()

dataPieces.forEach(x =>{
  results.push(invokeComputationLambda(x))
})

results.forEach(x => {
  x.then(partialAnswer => {
    answers.push(partialAnswer)
  })
})

Promise.all(results).then(() => {
  var sum = answers.reduce((y,x) => {
    return y + x
  })
  console.log(sum)
})


function getChildren(){
    var promise = new Promise((resolve,reject)=>{
         domakeDatabaseCall(function(){

           //Handle logic processing database result
           resolve(getChildren()) // call again when done
         })
    })

    return promise
}
