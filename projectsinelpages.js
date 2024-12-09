function listThisproject(projectid){
    
    document.getElementById("projectbutton").click();
    const projectobject = findObject(projectid,JSON.parse(localStorage.getItem("project")));
    console.log(projectobject);
    
    const wrapper = document.getElementById("projectviewwrapper");
    
    const projectname = wrapper.getElementsByClassName("projectname")[0];
    projectname.dataset.airtable = projectid;
    projectname.value = projectobject.name;
    
    const customername = wrapper.getElementsByClassName("customer")[0];
    customername.value = projectobject.customer;
    
    const companynametext = wrapper.getElementsByClassName("companynametext")[0];
    const companyobject = findObject(projectobject.company[0],JSON.parse(localStorage.getItem("company")));
    companynametext.innerHTML = companyobject.name;
    companynametext.onclick = function(){listThiscompany(companyobject.airtable)};
     
    const creatdate = wrapper.getElementsByClassName("creatdate")[0];
    creatdate.value = convertinputDate(projectobject.created);
    
    const startdate = wrapper.getElementsByClassName("startdate")[0];
    startdate.value = projectobject.startdate;
    
    const enddate = wrapper.getElementsByClassName("enddate")[0];
    enddate.value = projectobject.enddate
    
    
    const select = wrapper.getElementsByClassName("statusselector")[0];
    select.value = projectobject.status;
    
    if(projectobject.status == "Tilbud"){
        document.getElementById("deleteprojectbutton").style.display = "inline-block";
        lookdivStatus(false);
    }else{
        lookdivStatus(true);
        document.getElementById("deleteprojectbutton").style.display = "none";
    }
    
    const deletebutton = document.getElementById("deleteprojectbutton");
    deletebutton.dataset.airtable = projectid;
    
    
    visualizeproject(projectobject,wrapper);
    
    estimatInfo(projectobject,wrapper);
    
   
}
function projectheaderchange(){

    document.getElementById("saveprojectbutton").style.display = "inline-block";

}


function saveLocal(object,dbname){

var dblist = JSON.parse(localStorage.getItem(dbname));
    
    for (var i = 0;i<dblist.length;i++){
       if(dblist[i].airtable == object.airtable){
          dblist[i]=object; 
          localStorage.setItem(dbname, JSON.stringify(dblist));
          return dblist;
       } 
    }

   return false; 
}

function saveProjectOnserver(projectobject){
let airtable = projectobject.airtable;     
//fjerne calculerte felt
delete projectobject.company;
delete projectobject.username;
delete projectobject.created;
delete projectobject.esum;
delete projectobject.fsum;
delete projectobject.airtable;
delete projectobject.clientid;
delete projectobject.companyid;

PATCHairtable("appcHyn9YLhSAgX0C","tblFd1vjAHci5wZD2",airtable,JSON.stringify(projectobject),"responsupdatedproject");
}

function responsupdatedproject(data,id){
console.log("responsupdatedproject",data);
}

function visualizeproject(projectobject,wrapper){

const varekostnad = wrapper.getElementsByClassName("varekostnad")[0];
varekostnad.innerHTML = projectobject.fvarekostnad+"K"+"/"+projectobject.evarekostnad+"K";

const vsoyle = wrapper.getElementsByClassName("vsoyle")[0];
const bgvsoyle = wrapper.getElementsByClassName("vsoylebg")[0];
let vs = Number(((projectobject.fvarekostnad/projectobject.evarekostnad)*100));
if(isNaN(vs)){
    vs = 0;
 vsoyle.style.width = 0+"%";   
}else if(vs>100){
  bgvsoyle.style.width = ((100/vs)*100)+"%";
 vsoyle.style.width = 100+"%"; 
}else{
 vsoyle.style.width = vs+"%";   
}
const procenttext1 = vsoyle.getElementsByClassName("procenttext")[0];
procenttext1.innerHTML = round(vs, 1)+"%";




const arbeidskostnad = wrapper.getElementsByClassName("arbeidskostnad")[0];
arbeidskostnad.innerHTML = projectobject.ftimekostnad+"K"+"/"+projectobject.etimekostnad+"K";

const tsoyle = wrapper.getElementsByClassName("tsoyle")[0];
const bgtsoyle = wrapper.getElementsByClassName("bgtsoyle")[0];
let ts = Number(((Number(projectobject.ftimekostnad)/Number(projectobject.etimekostnad))*100));
if(isNaN(ts)){
    ts = 0;
    tsoyle.style.width = 0+"%";
    bgtsoyle.style.width = 100+"%";
}
if(ts>100){
    bgtsoyle.style.width = ((100/ts)*100)+"%";
    tsoyle.style.width = 100+"%";
}else{
  tsoyle.style.width = ts+"%"; 
  bgtsoyle.style.width = 100+"%";
}


const procenttext2 = tsoyle.getElementsByClassName("procenttext")[0];
procenttext2.innerHTML = round(ts, 1)+"%";

const fremmedytelse = wrapper.getElementsByClassName("fremmedytelse")[0];
fremmedytelse.innerHTML = projectobject.ffremmedytelse+"K"+"/"+projectobject.efremmedytelse+"K";

const fsoyle = wrapper.getElementsByClassName("fsoyle")[0];
const bgfsoyle = wrapper.getElementsByClassName("bgfsoyle")[0];
let fs = Number(((projectobject.ffremmedytelse/projectobject.efremmedytelse)*100));
if(isNaN(fs)){
    fs = 0;
    fsoyle.style.width = 0+"%";
    bgfsoyle.style.width = 100+"%";
}
if(fs>100){
    bgfsoyle.style.width = ((100/fs)*100)+"%";
    fsoyle.style.width = 100+"%";
}else{
  fsoyle.style.width = fs+"%";
   bgfsoyle.style.width = 100+"%";
}
const procenttext3 = fsoyle.getElementsByClassName("procenttext")[0];
procenttext3.innerHTML = round(fs, 1)+"%";

const andrekostnader = wrapper.getElementsByClassName("andrekostnader")[0];
andrekostnader.innerHTML = projectobject.fandrekostnader+"K"+"/"+projectobject.eandrekostnader+"K";

const asoyle = wrapper.getElementsByClassName("asoyle")[0];
const bgasoyle = wrapper.getElementsByClassName("bgasoyle")[0];
let as = Number(((projectobject.fandrekostnader/projectobject.eandrekostnader)*100));
if(isNaN(as)){
    as = 0;
    asoyle.style.width = 0+"%";
    bgasoyle.style.width = 100+"%";
}
if(as>100){
    bgasoyle.style.width = ((100/as)*100)+"%";
    asoyle.style.width = 100+"%";
}else{
  asoyle.style.width = as+"%";
  bgasoyle.style.width = 100+"%";
}


const procenttext4 = asoyle.getElementsByClassName("procenttext")[0];
procenttext4.innerHTML = round(as, 1)+"%";

 const ekostnader = wrapper.getElementsByClassName("ekostnader")[0];
   ekostnader.innerHTML = (projectobject.evarekostnad+projectobject.etimekostnad+projectobject.efremmedytelse+projectobject.eandrekostnader)+"K";
   
 const fkostnader = wrapper.getElementsByClassName("fkostnader")[0];
   fkostnader.innerHTML = (projectobject.fvarekostnad+projectobject.ftimekostnad+projectobject.ffremmedytelse+projectobject.fandrekostnader)+"K";
   

}

function projectestimatchange(){

    document.getElementById("saveprojectestimatbutton").style.display = "inline-block";
    const wrapper = document.getElementById("projectviewwrapper");
   //utregning
    var eoverskudd = Number(wrapper.getElementsByClassName("inputeoverskudd")[0].value);
    var evarekostnad = Number(wrapper.getElementsByClassName("inputevarekostnad")[0].value);
    var etimekostnad = Number(wrapper.getElementsByClassName("inputetimekostnad")[0].value);
    var efremmedytelse = Number(wrapper.getElementsByClassName("inputefremmedytelse")[0].value);
    var eandrekostnader = Number(wrapper.getElementsByClassName("inputeandrekostnader")[0].value);

    const eprosjektpris = wrapper.getElementsByClassName("eprosjektpris")[0];
    var esum =  eoverskudd+evarekostnad+etimekostnad+efremmedytelse+eandrekostnader;
    eprosjektpris.innerHTML = esum;
    var projectid = eprosjektpris.dataset.airtable;
 
 
 
 
    //utregning
   // var foverskudd = Number(wrapper.getElementsByClassName("inputeoverskudd")[0].value);
    var fvarekostnad = Number(wrapper.getElementsByClassName("inputfvarekostnad")[0].value);
    var ftimekostnad = Number(wrapper.getElementsByClassName("inputftimekostnad")[0].value);
    var ffremmedytelse = Number(wrapper.getElementsByClassName("inputffremmedytelse")[0].value);
    var fandrekostnader = Number(wrapper.getElementsByClassName("inputfandrekostnader")[0].value);
 
 
    const elementfoverskudd = wrapper.getElementsByClassName("foverskudd")[0];
    var foverskudd = esum - fvarekostnad-ftimekostnad-ffremmedytelse-fandrekostnader;
    elementfoverskudd.innerHTML = foverskudd;
    
    const elementfsum = wrapper.getElementsByClassName("fprosjektpris")[0];
    var fsum = esum;
    elementfsum.innerHTML = esum;

    //finne projectobjectet oppdatere det (men ikke lagre)
    const projectobject = findObject(projectid,JSON.parse(localStorage.getItem("project")));
    
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
    

    visualizeproject(projectobject,wrapper);
 
}