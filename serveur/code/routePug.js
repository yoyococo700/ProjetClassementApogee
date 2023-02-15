
const sqliteJson = require('sqlite-json');
const exporter = sqliteJson('../../Students2023_new.db');

var nbConnectionPagePrincipal = 0;
var nbConnectionPageEtudiant = 0;

//Retourne la liste d'UE suivi par un numero etudiant
function getUE(num){
  var getUEQuery = "SELECT UE from jury WHERE numero_etudiant='?'";
  var UE;
  getUEQuery =  getUEQuery.replace("?",num.toString());  
  exporter.json(getUEQuery, function (err, json) {
    UE = JSON.parse(json);
  });
  return UE;
}

function getAllUE(){
  var query = "select distinct UE from jury;";
  var tab = [];
  exporter.json(query,function(err,json){
    var rep = JSON.parse(json);
    rep.forEach(element => {
      tab.push(element.UE);
    });
  });
  return tab;
}


function getMoyEtu(num){
  var query = "Select * from (SELECT numero_etudiant, moyenne, DENSE_RANK() OVER (ORDER BY moyenne DESC) rangS1 FROM (SELECT numero_etudiant,sum(session1 * ECTS) / sum(ECTS) AS moyenne FROM jury GROUP BY numero_etudiant HAVING sum(ECTS) = 15)) where numero_etudiant ='"+num+"' ;";
  var rep;
  exporter.json(query,function(err,json){
    rep = JSON.parse(json)[0];
  });
  console.log(rep);
  return rep;
}

function getMoyEtuLeaderboard(){
  var query = "SELECT numero_etudiant, moyenne, DENSE_RANK() OVER (ORDER BY moyenne DESC) rangS1 FROM (SELECT numero_etudiant,sum(session1 * ECTS) / sum(ECTS) AS moyenne FROM jury  GROUP BY numero_etudiant HAVING sum(ECTS) = 15) LIMIT 0,10;";
  var rep;
  exporter.json(query,function(err,json){
    rep = JSON.parse(json);
  });
  return rep;
}

function getNbEtu15ECTS(){
  var query = "SELECT * FROM jury GROUP BY numero_etudiant HAVING sum(ECTS) = 15;";
  var rep=0;
  exporter.json(query,function(err,json){
    rep = JSON.parse(json).length;
  });
  return rep;
}

function getLeaderboard(UE){
  var query = "SELECT numero_etudiant,session1,rangS1\
  FROM (\
           SELECT numero_etudiant,\
                  session1,\
                  UE,\
                  DENSE_RANK() OVER (ORDER BY session1 DESC) rangS1\
             FROM jury\
             WHERE (UE = '?')\
       )\
LIMIT 0,10;".replace("?",UE);
  var data;
  exporter.json(query,function(err,json){
    data = JSON.parse(json);
    
  });
  var rep =  {
    UE: UE,
    data : data,
  };
  return rep;
}


//retourne le nombre d'etudiants qui suivent l'UE
function getNumberEtudiant(UE){
  var query = "SELECT session1 FROM jury where UE=\'"+UE+"\';";
  var rep = 0;
  exporter.json(query,function(err,json){
    rep = JSON.parse(json).length;
  });
  return rep;
}





//{"UE":"LU2ME006","session1":"74.500000","rangS1":"43","noteS2":"74.500000","rangS2":"4","RangGlobal":"45","total":"284"}
function getReponseNote(num){
  var getNoteQuery = "SELECT UE,session1,rangS1\
  FROM (\
           SELECT numero_etudiant,\
                  session1,\
                  UE,\
                  DENSE_RANK() OVER (ORDER BY session1 DESC) rangS1\
             FROM jury\
             WHERE (UE = '?')\
       )\
 WHERE numero_etudiant='"+num.toString()+"'";
  var note =[];
  var UE=getUE(num);
  for (let index = 0; index < UE.length; index++) {
    var query = getNoteQuery.replace("?",UE[index].UE);
    var total = getNumberEtudiant(UE[index].UE);
    exporter.json(query, function (err, json) {
      var rep = JSON.parse(json)[0];
      rep.total = total; 
      note.push(rep);
    });
  }
  

  return note;
}

function getAllNotes(UE){
  var query = "SELECT session1 from jury where UE = '"+UE+"';";

  var dataS1 = [];
  var dataS2 = ['0'];
  exporter.json(query, function (err, json) {
    var rep = JSON.parse(json);
    rep.forEach(noteS1 => {
      dataS1.push(noteS1.session1);
    });
  });
  var reponse = {
    nom : UE,
    dataS1 : dataS1,
    dataS2 : dataS2,
  }
  return reponse
}

//retourne toutes les infos necessaire a l'affichage d'un graphique
function getJSONGraph(UE){
  var query = "SELECT COUNT(session1) as nombre,(CAST(session1 AS Int)/4)*4 as note FROM jury where UE = \'?\' group by (CAST(session1 AS Int)/4)*4 ;".replace("?",UE);

  var label = [];
  var dataS1 = [];
  var dataS2 = ['0'];
  exporter.json(query, function (err, json) {
    var rep = JSON.parse(json);
    rep.forEach(element => {
      dataS1.push(element.nombre);
      label.push(element.note)
    });
  });

  var reponse = {
    nom : UE,
    label: label,
    dataS1 : dataS1,
    dataS2 : dataS2,
  }
  return reponse;
}

//retourne toutes les infos necessaire a l'affichage du premier graphique
function getFirstJSONGraph(){
var query = "SELECT COUNT(session1int) as nombre, ( (session1int) / 4) * 4 as note FROM ( SELECT CAST (moyenne AS INT) AS session1int FROM ( SELECT * FROM ( SELECT numero_etudiant, moyenne, DENSE_RANK() OVER (ORDER BY moyenne DESC) rangS1 FROM ( SELECT numero_etudiant, sum(session1 * ECTS) / sum(ECTS) AS moyenne FROM jury  GROUP BY numero_etudiant HAVING sum(ECTS) = 15) ) ) ) GROUP BY ( (session1int) / 4) * 4"
  var label = [];
  var dataS1 = [];
  var dataS2 = ['0'];
  exporter.json(query, function (err, json) {
    var rep = JSON.parse(json);
    rep.forEach(element => {
      dataS1.push(element.nombre);
      label.push(element.note)
    });
  });

  var reponse = {
    nom : "General",
    label: label,
    dataS1 : dataS1,
    dataS2 : dataS2,
  }
  return reponse;
}


let port =8080;

const express = require('express');
var path = require('path');
const { cookie } = require('express/lib/response');
const app = express();

app.set('view engine', 'pug');





function hasQueryParams(url) {
  return url=="/";
}

function isValide(resultats){
    return resultats.toString()!="";
}

function checkNumIntegrity(num){
  var n = 0;
  exporter.json("SELECT numero_etudiant FROM jury where numero_etudiant = '"+num+"';",function(err,json){

    var rep = (JSON.parse(json));
    n = rep.length;
  });
  console.log(n);
  return n!=0;

}

app.use('/public',express.static(path.join(__dirname, 'public')));

app.listen(port,() => {
    console.log(`App running on port ${port}`);
  })

app.get('/public/utils.js', function (request, response){
    console.log("utils.js");
    response.sendFile(path.join(__dirname + '/utils.js'));

})



  app.get('/leaderboard', function(request,response){
    console.log("leaderboard");
    var rep =[];
    var list_UE = getAllUE();
    list_UE.forEach(element => {
      rep.push(getLeaderboard(element));
    });
    response.render("leaderboard",{data: JSON.stringify(rep), general_leaderboard_data : JSON.stringify(getMoyEtuLeaderboard())});
  })

  app.get('/', function(request, response){
    //console.log("reponsedu serv");
    var today= new Date();    
    console.log("-------------------------------");
    num = request.query.num;
    nbConnectionPagePrincipal++;
    console.log("Nombres de connections a la page principale:"+nbConnectionPagePrincipal);
    console.log(today.toLocaleTimeString()+"  "+num);

    if (hasQueryParams(request.url)){
        response.set("Bypass-Tunnel-Reminder");
        response.render('index',{});
        console.log("page acceuil");
    }

    else{
      //Page affichage note
        if (checkNumIntegrity(num)) {
          var notes = getReponseNote(num);
          var moyEtu = getMoyEtu(num);

          nbConnectionPageEtudiant++;
          console.log("Nombres de connections a la page etudiant:"+nbConnectionPageEtudiant);
          notes.push({
            UE : "General",
            session1 : moyEtu.moyenne,
            rangS1 : moyEtu.rangS1,
            total : getNbEtu15ECTS()
          });

          //console.log(notes);
          if (isValide(notes)) {
            var JSONGraph = []; 
            JSONGraph.push(getFirstJSONGraph()); 
            for (i = 0; i < notes.length; i++) {
                  // console.log(notes[i].UE);
                  JSONGraph.push(getJSONGraph(notes[i].UE));
            }
              //console.log(JSONGraph); 
              response.render("graph", { notes : JSON.stringify(notes) , graphData : JSON.stringify(JSONGraph), classement_data : JSON.stringify(moyEtu) , nb_etudiant : getNbEtu15ECTS()});
              console.log("page Tableau");
          }
          else{
              response.render("erreur",{num_etu : num});
              console.log("page erreur");
          }
        } 
        else{
            response.render("erreur",{num_etu : num});

        }

    }
    console.log("-------------------------------");
});