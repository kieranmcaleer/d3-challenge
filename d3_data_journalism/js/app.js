d3.csv("../data/data.csv", function(data){
    for(var i=0; i< data.length; i++){
        console.log(data[i])
    }
})