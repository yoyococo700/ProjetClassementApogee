const http = require('http');

const fs = require('fs').promises;
const { exec } = require("child_process");
var url = require('url');

let tableau;

page_tableau = fs.readFile(__dirname + "/affichage_note.html");
var demande;
var demandeObj;
var reponse;
const requestListener = function (req, res) {
    fs.readFile(__dirname + "/index.html")
    .then(contents => {
        var query = url.parse(req.url,true).query;
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200);
        if (req.url == "/" || req.url == "" ){
            console.log("page initiale");
            
            res.write(page_tableau);
            res.end();
        }

        else{
            console.log("Demande de code etudiant");
            demande = JSON.stringify(query)
            var objectValue = JSON.parse(demande);
            num_etu = objectValue['num'];
            exec("./a.out "+num_etu, (error, stdout, stderr) => reponse = stdout);

            var essai = JSON.parse(reponse);
            if (essai != NULL){
                res.write(page_tableau);
                
            }
            res.end();
        }  
        
        

        
       
        
    })
    .catch(err => {
        res.writeHead(500);
        res.end(err);
        return;
    });
    
    

    
}



const server = http.createServer(requestListener);
server.listen(8080);