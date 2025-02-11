function estimatInfo(projectobject,wrapper){

    const inputeoverskudd = wrapper.getElementsByClassName("inputeoverskudd")[0];
    inputeoverskudd.value = projectobject.eoverskudd;
    
    const inputevarekostnad = wrapper.getElementsByClassName("inputevarekostnad")[0];
    inputevarekostnad.value = projectobject.evarekostnad;
    
    const inputetimekostnad = wrapper.getElementsByClassName("inputetimekostnad")[0];
    inputetimekostnad.value = projectobject.etimekostnad;
    
    const inputefremmedytelse = wrapper.getElementsByClassName("inputefremmedytelse")[0];
    inputefremmedytelse.value = projectobject.efremmedytelse;
    
    const inputeandrekostnader = wrapper.getElementsByClassName("inputeandrekostnader")[0];
    inputeandrekostnader.value = projectobject.eandrekostnader;
    
    const eprosjektpris = wrapper.getElementsByClassName("eprosjektpris")[0];
    var esum = (projectobject.eoverskudd+projectobject.evarekostnad+projectobject.etimekostnad+projectobject.efremmedytelse+projectobject.eandrekostnader);
    
    eprosjektpris.innerHTML = esum;
    eprosjektpris.dataset.airtable = projectobject.airtable;

    const dekningsgrad = wrapper.querySelector(".dekningsg");
    if(dekningsgrad){
    dekningsgrad.textContent = Number(projectobject.eoverskudd)/esum;
    }
    const foverskudd = wrapper.getElementsByClassName("foverskudd")[0];
    foverskudd.innerHTML = projectobject.foverskudd;
    
    const inputfvarekostnad = wrapper.getElementsByClassName("inputfvarekostnad")[0];
    inputfvarekostnad.value = projectobject.fvarekostnad;
    
    const inputftimekostnad = wrapper.getElementsByClassName("inputftimekostnad")[0];
    inputftimekostnad.value = projectobject.ftimekostnad;
    
    const inputffremmedytelse = wrapper.getElementsByClassName("inputffremmedytelse")[0];
    inputffremmedytelse.value = projectobject.ffremmedytelse;
    
    const inputfandrekostnader = wrapper.getElementsByClassName("inputfandrekostnader")[0];
    inputfandrekostnader.value = projectobject.fandrekostnader;
    
    const fprosjektpris = wrapper.getElementsByClassName("fprosjektpris")[0];
   fprosjektpris.innerHTML = esum;
   
}


function projectheadersave(){

    document.getElementById("saveprojectbutton").style.display = "none";
    document.getElementById("saveprojectestimatbutton").style.display = "none";
    
    
    const wrapper = document.getElementById("projectviewwrapper")
    const projectname = wrapper.getElementsByClassName("projectname")[0];
    const projectobject = findObject(projectname.dataset.airtable,JSON.parse(localStorage.getItem("project")));

    let name = projectname.value;
    let customer = wrapper.getElementsByClassName("customer")[0].value;
    let creatdate = wrapper.getElementsByClassName("creatdate")[0].value;
    let startdate = wrapper.getElementsByClassName("startdate")[0].value;
    let enddate = wrapper.getElementsByClassName("enddate")[0].value;
    let status = wrapper.getElementsByClassName("statusselector")[0].value;
    if(status == "Tilbud"){
        document.getElementById("deleteprojectbutton").style.display = "inline-block";
         lookdivStatus(false);
    }else{
    		lookdivStatus(true);
        document.getElementById("deleteprojectbutton").style.display = "none";
    }
    let eoverskudd = Number(wrapper.getElementsByClassName("inputeoverskudd")[0].value);
    let evarekostnad = Number(wrapper.getElementsByClassName("inputevarekostnad")[0].value);
    let etimekostnad = Number(wrapper.getElementsByClassName("inputetimekostnad")[0].value);
    let efremmedytelse = Number(wrapper.getElementsByClassName("inputefremmedytelse")[0].value);
    let eandrekostnader = Number(wrapper.getElementsByClassName("inputeandrekostnader")[0].value);
    let esum =  eoverskudd+evarekostnad+etimekostnad+efremmedytelse+eandrekostnader;
    
    let fvarekostnad = Number(wrapper.getElementsByClassName("inputfvarekostnad")[0].value);
    let ftimekostnad = Number(wrapper.getElementsByClassName("inputftimekostnad")[0].value);
    let ffremmedytelse = Number(wrapper.getElementsByClassName("inputffremmedytelse")[0].value);
    let fandrekostnader = Number(wrapper.getElementsByClassName("inputfandrekostnader")[0].value);
    let foverskudd = esum - fvarekostnad-ftimekostnad-ffremmedytelse-fandrekostnader;
    let fsum = esum;
    
    
    projectobject.name = name;
    projectobject.customer = customer;
    projectobject.created = creatdate;
    projectobject.startdate = startdate;
    projectobject.enddate = enddate;
    projectobject.status = status;
    projectobject.eoverskudd = eoverskudd;
    projectobject.evarekostnad = evarekostnad;
    projectobject.etimekostnad = etimekostnad;
    projectobject.efremmedytelse = efremmedytelse;
    projectobject.eandrekostnader = eandrekostnader;
    projectobject.esum = esum;
    
    projectobject.foverskudd = foverskudd;
    projectobject.fvarekostnad = fvarekostnad;
    projectobject.ftimekostnad = ftimekostnad;
    projectobject.ffremmedytelse = ffremmedytelse;
    projectobject.fandrekostnader = fandrekostnader;
    projectobject.fsum = fsum;
    
 
    console.log("Save",projectobject);
    //calculere esum og fsum
    //lagre lokalt
    saveLocal(projectobject,"project");
    
    //lagre på server
    saveProjectOnserver(projectobject)
    
}

function creatnewproject(name,customer,status){


var client = JSON.parse(localStorage.getItem("clientobject"));
var user = JSON.parse(localStorage.getItem("userobject"));

var datetoday = convertinputDate("today");

var object = {name:name,customer:customer,status:status,startdate:datetoday,enddate:datetoday,client:[client.airtable],company:[selectedcompanyobject.airtable],user:[user.airtable]};
//send til server
POSTairtable("appcHyn9YLhSAgX0C","tblFd1vjAHci5wZD2",JSON.stringify(object),"respondpostnewproject");
}

function respondpostnewproject(data,id){
    var projectlist = [];
    if(localStorage.getItem("project")){
    projectlist = JSON.parse(localStorage.getItem("project"));
    }
    projectlist.push(data.fields);
    
    //lagere projectlist
    localStorage.setItem("project", JSON.stringify(projectlist));  
    
    listThisproject(data.fields.airtable);
    document.getElementById('projectbutton').click();
}

function deleteProject(projectid){
    
  //alert  
 let text = "Ønsker du å slette dette prosjektet?";
  if (confirm(text) == true) {
    console.log("JA");
    //fjerne lokalt
    var allItem = JSON.parse(localStorage.getItem("project"));
    allItem = deleteObject(projectid,allItem);
    localStorage.setItem("project",JSON.stringify(allItem));
    
    DELETEairtable("appcHyn9YLhSAgX0C","tblFd1vjAHci5wZD2",projectid,"responsdeletedProject");
    //trykk på tilbakeknapp
    document.getElementById("backfromproject").click();
  } else {
     console.log("NEI")
  }
  
}

function responsdeletedProject(data,id){
    
}
