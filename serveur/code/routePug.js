const http = require('http');

// const fs = require('fs').promises;
 const { execSync } = require("child_process");
var url = require('url');




// let tableau;

// page_tableau = fs.readFile(__dirname + "/affichage_note.html");
// page_acceuil = fs.readFile(__dirname + "/index.html");
// var demande;
// var demandeObj;
// var reponse;
let port =8080;

const express = require('express');
var path = require('path');
const app = express();

app.set('view engine', 'pug');


let reponse;
// app.get('/', function(request, response){
//     response.render('index', { })
// });
function hasQueryParams(url) {
  return url=="/";
}

function isValide(resultats){
    // return resultats.toString()!="";
    return true;
}

function checkNumIntegrity(num){
  console.log(num.includes(" "));
  return !num.includes(" ");

}

app.use('/public',express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

app.get('/public/utils.js', function (request, response){
    console.log("utils.js");
    response.sendFile(path.join(__dirname + '/utils.js'));

})


  app.get('/', function(request, response){
    //console.log("reponsedu serv");
    var today= new Date();    
    console.log("-------------------------------");
    num = request.query.num;
    
    console.log(today.toLocaleTimeString()+"  "+num);
    if (hasQueryParams(request.url)){
        response.set("Bypass-Tunnel-Reminder");
        response.render('index',{});
        console.log("page acceuil");
    }

    else{
      //Page affichage note
        if (checkNumIntegrity(num)) {
            reponseNotes = execSync("./C/notes " + num).toString();
            
            console.log(reponseNotes);
            var notes = JSON.parse(reponseNotes);
            // console.log(notes);


            var JSONGraph = [];


            if (isValide(notes)) {
                for (i = 0; i < notes.length; i++) {
                    // console.log(notes[i].UE);
                    JSONGraph.push(JSON.parse(execSync("./C/getAllNote " + notes[i].UE).toString()));
                }
                //console.log(JSON.stringify(notes));                
                response.render("graph", { notes : JSON.stringify(notes) , graphData : JSON.stringify(JSONGraph)});
                console.log("page Tableau");
            }
            else{
                response.render("erreur",{num_etu : num});
                console.log("page erreur");
            }
        } 
        else{
            response.render("erreur",{num_etu : num});
            console.log("page Tableau avec erreur");
        }

    }
    console.log("-------------------------------");
});