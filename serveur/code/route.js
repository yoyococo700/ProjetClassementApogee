const http = require('http');

// const fs = require('fs').promises;
 const { execSync } = require("child_process");
// var url = require('url');

// let tableau;

// page_tableau = fs.readFile(__dirname + "/affichage_note.html");
// page_acceuil = fs.readFile(__dirname + "/index.html");
// var demande;
// var demandeObj;
// var reponse;
let port =8080;

const express = require('express');
const app = express();
let reponse;
app.get('/', function(request, response){
    //console.log("reponsedu serv");
    num = request.query.num;
    console.log(parseInt(num));
    
    if (parseInt(num) < 20000){
        response.sendFile(__dirname + '/index.html');
        console.log("page acceuil");
    }
    else{
        
        
        reponse = execSync("./a.out "+ num).toString();
        
        console.log(reponse);
        var essai = JSON.parse(reponse);
        console.log(essai);
        if (true){
            response.sendFile(__dirname,"/affichage_note.html");
            console.log("page Tableau");
        }

    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


// const requestListener = function (req, res) {
//     fs.readFile(__dirname + "/index.html")
//     .then(contents => {
//         var query = url.parse(req.url,true).query;
//         res.setHeader("Content-Type", "text/html");
//         if (req.url == "/" || req.url == "" ){
//             console.log("page initiale");
//             res.writeHead(200);
//             res.write(contents);
//             res.end();
//         }
//         else{
//             console.log("Demande de code etudiant");
//             demande = JSON.stringify(query)
//             var objectValue = JSON.parse(demande);
//             num_etu = objectValue['num'];
//             exec("./a.out "+num_etu, (error, stdout, stderr) => reponse = stdout);

//             var essai = JSON.parse(reponse);
//             if (essai != NULL){
//                 res.writeHead(200);
//                 res.write(page_tableau);
                
//             }
//             res.end();
//         }       
//     })
//     .catch(err => {
//         res.writeHead(500);
//         res.end(err);
//         return;
//     });
// }


// const http = require('http');

// http.createServer((request, response) => {
//   const { headers, method, url } = request;
//   let body = [];
//   request.on('error', (err) => {
//     console.error(err);
//   }).on('data', (chunk) => {
//     body.push(chunk);
//   }).on('end', () => {
//     body = Buffer.concat(body).toString();

//     // BEGINNING OF NEW STUFF

//     response.on('error', (err) => {
//       console.error(err);
//     });

//     response.statusCode = 200;
//     response.setHeader('Content-Type', 'Text');
//     // Note: the 2 lines above could be replaced with this next one:
//     // response.writeHead(200, {'Content-Type': 'application/json'})

//     const responseBody = { headers, method, url, body };

//     response.write(JSON.stringify(responseBody));
//     response.end();
//     // Note: the 2 lines above could be replaced with this next one:
//     // response.end(JSON.stringify(responseBody))

//     // END OF NEW STUFF
//   });
// }).listen(8080);