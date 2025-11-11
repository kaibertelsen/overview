
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

   /*
   //oppdater lable
   if(data.fields?.Name){
   document.getElementById("clientnamelable").textContent = data.fields.Name
   }else{
    document.getElementById("clientnamelable").textContent = "-"
   }
    */
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


function gettime(date){
    var d = new Date(date);
   
   if (typeof(date) == "undefined"){
   d = new Date();
   }
    
   
     let year = d.getFullYear();
   
     let mnd = findmontname(d.getMonth());
     let day = d.getDate();
   
   
     var hour = d.getHours();
     if(hour<10){
     hour = "0"+hour;
     }
   
     var min = d.getMinutes();
     if(min<10){
     min = "0"+min;
     }
   
     var sec = d.getSeconds();
     if(sec<10){
     sec = "0"+sec;
     }
     return day+"."+mnd+" "+year;
   }
   
   function updatetime(){
   
     document.getElementById("updatetime").innerHTML = gettime(ontrackMonitoring);
     
   }
   
   
   function updateClientdata(){
          
        var clientobject = JSON.parse(localStorage.getItem("clientobject"));      
        const list = document.getElementById("sumview");

        //oppdater lable
        if(clientobject.Name){
        document.getElementById("clientnamelable").textContent = clientobject.Name
        }

        //sjekke om det er prosjektmodul
        if(clientobject.projectmodul){
            document.getElementById("toprojectviewfrommaster").style.display = "block";
        }else{
            document.getElementById("toprojectviewfrommaster").style.display = "none"; 
        }
        
       //customer
       const customer = list.getElementsByClassName("customer")[0];
       var customervalue = round(Number(clientobject.sumcustomervalue), 1);
       customervalue = valutalook(customervalue);
       customer.innerHTML = customervalue+"K";  
          
       //supplier
       const supplier = list.getElementsByClassName("supplier")[0];
       var suppliervalue = round(Number(clientobject.sumsuppliervalue), 1);
       suppliervalue = valutalook(suppliervalue);
       supplier.innerHTML = suppliervalue+"K";   
       
       //difference   
       const difference = list.getElementsByClassName("difference")[0];
       var differencevalue = round(Number(clientobject.diffsuppliercustomer), 1);
       differencevalue = valutalook(differencevalue);
       difference.innerHTML = differencevalue+"K";    
       
       //profit
       const profit = list.getElementsByClassName("profit")[0];
       var profitvalue = round(Number(clientobject.profittoday), 1);
       profitvalue = valutalook(profitvalue);
       profit.innerHTML = profitvalue+"K"; 
       
     
        //statusbar
         const selectfield = list.getElementsByClassName("selectfield")[0];
         var ontrackvalue = clientOntrackToDate(clientobject)*100;
          if(ontrackvalue<0){
             ontrackvalue = 0;
           }
           
         selectfield.style.width = ontrackvalue+"%";  
         
         
       //year budget
       const lowbudgetyear = list.getElementsByClassName("lowbudget")[0];
       var lowbudgetyearvalue = round(Number(clientobject.yearbudgetlow), 1);
       lowbudgetyearvalue = valutalook(lowbudgetyearvalue);
       lowbudgetyear.innerHTML = lowbudgetyearvalue+"K"; 
       
       //lowbudgettoday
       const lowbudgettoday = list.getElementsByClassName("lowbudgettoday")[0];
       var lowbudgettodayvalue = round(BudgetToDate(clientobject,clientobject.yearbudgetlow), 1);
       lowbudgettodayvalue = valutalook(lowbudgettodayvalue);
       lowbudgettoday.innerHTML = lowbudgettodayvalue+"K"; 
       
         
       const highbudgetyear = list.getElementsByClassName("highbudget")[0];
       var highbudgetyearvalue = round(Number(clientobject.yearbudgethight), 1);
       highbudgetyearvalue = valutalook(highbudgetyearvalue);
       highbudgetyear.innerHTML = highbudgetyearvalue+"K";   
       
          
       const hightbudgettoday = list.getElementsByClassName("hightbudgettoday")[0];
       var hightbudgettodayvalue = round(BudgetToDate(clientobject,clientobject.yearbudgethight), 1);
       hightbudgettodayvalue = valutalook(hightbudgettodayvalue);
       hightbudgettoday.innerHTML = hightbudgettodayvalue+"K"; 
         
   
             
   }
