
function downloadUserObject(userid){
    airtableGet("appcHyn9YLhSAgX0C","tblXfT4OnjC0c3nuw",userid,"responsgetUser");
}

function responsgetUser(data,id){
  //lagre
   localStorage.setItem("userobject", JSON.stringify(data.fields));     
      
    if(data.fields?.client){
        //laste ned client
        downloadclientObject(data.fields.client[0])
    }
    
    if(data.fields?.roll){
        if (data.fields.roll == "user"){
             if(data.fields?.company){
         airtableGet("appcHyn9YLhSAgX0C","tbl3hyMxfLFEB2OwI",data.fields.company[0],"responsgetCompany");   
             } 
        }else if(data.fields.roll == "admin"){
            if(data.fields?.company){
                //laste ned client
                downloadcompanylist(data.fields.client[0]);
            }
        } 
    }
    
    
  }


function downloadclientObject(clientid){
    airtableGet("appcHyn9YLhSAgX0C","tbleBGTuZ9zvquwuc",clientid,"responsgetClient");
}

function responsgetClient(data,id){
 //lagre
   localStorage.setItem("clientobject", JSON.stringify(data.fields));  
   updateClientdata();  

   //oppdater lable
   if(fields?.Name){
   document.getElementById("clientnamelable").textContent = fields.Name
   }else{
    document.getElementById("clientnamelable").textContent = "-"
   }
}


function downloadcompanylist(clientid){

    let body = FindListbody(clientid,"clientid");
    apilistcall("appcHyn9YLhSAgX0C","tbl3hyMxfLFEB2OwI",body,"responscompanylist");

}

function responscompanylist(data,id){
      var cleandata = rawdatacleaner(data);
     //lagere companylist
      localStorage.setItem("company", JSON.stringify(cleandata));
      listCardOverview();
      localStorage.setItem("updatetime", gettime());
      updatetime();
}

function downloadbudgetlist(clientid){
      
    let body = FindListbody(clientid,"clientid");
    apilistcall("appcHyn9YLhSAgX0C","tblNbov7LUsMV1aAH",body,"responsdudgetlist");
}

function responsdudgetlist(data,id){
      var cleandata = rawdatacleaner(data);
     //lagre
      localStorage.setItem("budget", JSON.stringify(cleandata));  
}

function downloadarchivedlist(clientid){
      
    let body = FindListbody(clientid,"clientid");
    apilistcall("appcHyn9YLhSAgX0C","tbl372FoJzWcpFHHh",body,"responsarchivedlist");
}

function responsarchivedlist(data,id){
      var cleandata = rawdatacleaner(data);
     //lagre
      localStorage.setItem("archived", JSON.stringify(cleandata));  
}

function responsgetCompany(data,id){
      var listkonverter = [];
      listkonverter.push(data.fields);
     //lagere companylist
      localStorage.setItem("company", JSON.stringify(listkonverter));
      listThiscompany(data.fields.airtable);
      
      downloadprojectlistCompany(data.fields.airtable);
      localStorage.setItem("updatetime", gettime());
      updatetime();
}

function downloadprojectlistCompany(companyid){
    let body = FindListbody(companyid,"companyid");
    apilistcall("appcHyn9YLhSAgX0C","tblFd1vjAHci5wZD2",body,"responsprojectlistCompany");

}

function responsprojectlistCompany(data,id){
       var cleandata = rawdatacleaner(data);
     //lagere companylist
      localStorage.setItem("project", JSON.stringify(cleandata));
      if(cleandata.length>0){
     listThiscompany(cleandata[0].companyid[0]);
      }
}

