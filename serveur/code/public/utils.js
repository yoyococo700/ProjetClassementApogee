function findNoteS1(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return note[i].session1;
    }
  }
}

function findRangS1(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return (note[i].rangS1.toString() + "/" +note[i].total.toString() );
    }
  }
}

function findRangS2(note,UE){
  // for (var i = 0; i< note.length; i++){
  //   if (note[i].UE == UE){
  //     return (note[i].rangS2.toString() + "/");
  //   }
  // }
  return 0;
}

function findNoteS2(note,UE){
  // 
  return 0;
}

function drawColorS1(note,UE){
  var note = findNoteS1(note,UE);
  var normalColor = "rgb(62,149,205,0.8)";
  var eleveColor = "red";
  var tab = [];
  for (let index = 0; index < 50; index++) {
    if (index*2<=note && (index+1)*2>note)
      tab.push(eleveColor);
    else
      tab.push(normalColor);
  }
  return tab;
}

function essaiInjection(){
  console.log("Injection");

}

function drawColorS2(note,UE){
  var note = findNoteS2(note,UE);
  var normalColor = "rgb(60,186,159,0.8)";
  var eleveColor = "purple";
  var tab = [];
  for (let index = 0; index < 50; index++) {
    if (index*2<=note && (index+1)*2>note)
      tab.push(eleveColor);
    else
      tab.push(normalColor);
  }
  return tab;
}

function drawGraph(data,note){
    var div = document.getElementById('chart-wrapper');
    
    var noteDiv = document.createElement('div');
    noteDiv.id = data.nom+"-div";
    noteDiv.setAttribute("class","container");
    var newCanvas = document.createElement("canvas");
    newCanvas.id = data.nom + "-canvas";
    
    newCanvas.width = 300;
    newCanvas.height = 200;
    
    noteDiv.appendChild(newCanvas);
    div.appendChild(noteDiv);

      var myChart = new Chart(newCanvas, {
          type: 'line',
          data: {
            labels: data.label,
            datasets: [{ 
                data: data.dataS1,
                label: "Session 1",
                borderColor: "rgb(62,149,205)",
                backgroundColor: drawColorS1(note,data.nom),
              }, { 
                data: data.dataS2,
                label: "Session 2",
                borderColor: "rgb(60,186,159)",
                backgroundColor: drawColorS2(note,data.nom),
              }

            ]
          },
          options: {
              
            legend: {
              labels: {
                 fontColor: 'white'
              }
            },
            title: {
                display: true,
                text: data.nom,
                fontColor :"orange",
                fontSize : 20
                
            },
            responsive: true,
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Nombre etudiants',
                  fontColor: "white"
                },
                ticks: {
                  fontColor: "white",
               }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Notes',
                  fontColor: "white" 
                },
                ticks: {
                  fontColor: "white",
               }
              }]
            }     
          }
      })
      
    }


    //{"UE":"LU2ME006","noteS1":"74.500000","rangS1":"43","noteS2":"74.500000","rangS2":"4","RangGlobal":"45","total":"284"}
    function CreateTableFromJSON(data,note) {
      myBooks = note;

      // EXTRACT VALUE FOR HTML HEADER.
      // ('Book ID', 'Book Name', 'Category' and 'Price')
      var col = ["","Session 1","Session 2"];
      
      // CREATE DYNAMIC TABLE.
      var table = document.createElement("table");
      table.classList.add("center");
      // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
      var tr = table.insertRow(-1); // TABLE ROW.
      for (var i = 0; i < col.length; i++) {
          var th = document.createElement("th");
          if (i!=0)
            th.classList.add("cell"); // TABLE HEADER.
          th.innerHTML = col[i];
          tr.appendChild(th);
      }
  //data.nom == UE
  //data.dataS1 = ['0','21'] 
      tr = table.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = "Note";
      tabCell.classList.add("cell");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = findNoteS1(note,data.nom);
      tabCell.classList.add("cell2");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = findNoteS2(note,data.nom);
      tabCell.classList.add("cell2");

      tr = table.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = "Rang";
      tabCell.classList.add("cell");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = findRangS1(note,data.nom);
      tabCell.classList.add("cell2");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = findRangS2(note,data.nom);
      tabCell.classList.add("cell2");

      


      // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
      var divContainer = document.getElementById(data.nom+"-div");
      //divContainer.innerHTML = "";
      divContainer.appendChild(table);
  }



function phraseHaut(rep,nb_etudiant){
  var div = document.getElementById('header');
  var phrase = document.createElement('h2');
  phrase.className = "cell";
  var text = "Vous etes " + rep.rangS1 +" / "+nb_etudiant+" avec une moyenne de "+ rep.moyenne + "/100";
  phrase.innerHTML = text;
  div.appendChild(phrase);
}

function CreateLeaderboardFromJSON(rep){
    var button = document.createElement("button-"+rep.UE);
    button.className = "accordion";
    button.innerHTML = rep.UE;
    var leaderboard_wrapper = document.getElementById("leaderboard-wrapper");
    var panel_div = document.createElement("panel-div-"+rep.UE);
    panel_div.className = "panel";



    var col = ["Numero etudiant","Note","Rang"];
    
    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");
    table.classList.add("styled-table");
    
    var thead = document.createElement("thead");
    var tr = table.insertRow(-1); // TABLE ROW.
    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");
        th.innerHTML = col[i];
        tr.appendChild(th);
    }
    thead.appendChild(tr);
    table.appendChild(thead);

    var tbody = document.createElement("tbody");
    rep.data.forEach(element => {
      
      
      var tr = tbody.insertRow(-1);
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = element.numero_etudiant;
      tabCell.classList.add("cell");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = element.session1;
      tabCell.classList.add("cell2");
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = element.rangS1;
      tabCell.classList.add("cell2");

    });
    table.appendChild(tbody);
    panel_div.appendChild(table);
    leaderboard_wrapper.appendChild(button);
    leaderboard_wrapper.appendChild(panel_div);
}

function CreateGeneralLeaderboard(rep){

  var leaderboard_general = document.getElementById("leaderboard-general");
  var panel_div = document.createElement("panel-div-general");
  panel_div.className = "panel-general";




  var col = ["Numero etudiant","Note","Rang"];
  
  // CREATE DYNAMIC TABLE.
  var table = document.createElement("table");
  table.classList.add("styled-table");
  
  var thead = document.createElement("thead");
  var tr = table.insertRow(-1); // TABLE ROW.
  for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th");
      th.innerHTML = col[i];
      tr.appendChild(th);
  }
  thead.appendChild(tr);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");
  rep.forEach(element => {
  
    var tr = tbody.insertRow(-1);
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = element.numero_etudiant;
    tabCell.classList.add("cell");
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = element.moyenne;
    tabCell.classList.add("cell2");
    var tabCell = tr.insertCell(-1);
    tabCell.innerHTML = element.rangS1;
    tabCell.classList.add("cell2");
  });
  table.appendChild(tbody);
  panel_div.appendChild(table);
  leaderboard_general.appendChild(panel_div);
}






function accordeon(){
  var acc = document.getElementsByClassName("accordion");
  var i;
  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;

      if (panel.style.display === "flex") {
        panel.style.display = "none";
      } else {
        panel.style.display = "flex";
      }
    });
  }
}

