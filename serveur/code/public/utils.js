function findNoteS1(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return note[i].noteS1;
    }
  }
}

function findRangS1(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return (note[i].rangS1.toString() + "/" + note[i].total.toString());
    }
  }
}

function findRangS2(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return (note[i].rangS2.toString() + "/" + note[i].totalS2.toString());
    }
  }
}

function findNoteS2(note,UE){
  for (var i = 0; i< note.length; i++){
    if (note[i].UE == UE){
      return note[i].noteS2;
    }
  }
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