

function userStartupfirstTime(userid){
if(localStorage.getItem("clientobject")){
updateClientdata()
}

if(localStorage.getItem("company")){
    var userobject = JSON.parse(localStorage.getItem("userobject"));  
    
    if (userobject.roll == "user"){
        if(userobject?.company){
        listThiscompany(userobject.company[0]);   
        }
    }else if (userobject.roll == "admin"){
        listCardOverview();
    }
}

//last ned userobject
downloadUserObject(userid)
        
}


function downloadUserObject(userid){
    airtableGet("appcHyn9YLhSAgX0C","tblXfT4OnjC0c3nuw",userid,"responsgetUser");
}

function responsgetUser(data,id){

    //lagre
   localStorage.setItem("userobject", JSON.stringify(data.fields));    

    //sjekke om det er flere clienter i user da må det komme opp en alert hvor en må hvelge mellom hvilke klienter en ønsker å se  
    if (data.fields?.client && data.fields.client.length>1){
    //vise en selektor for å velge klient
    showclientselector(data.fields.client,data.fields.clientname);
    }else{
        
        //laste ned client
        downloadclientObject(data.fields.client[0])
        

    }

    //sjekke roll
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

function showclientselector(clientIdlist, clientNamelist) {
    const selectordiv = document.getElementById("clientselectordiv");
    selectordiv.innerHTML = "";
    selectordiv.style.display = "flex";

    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "20px",
        width: "min(320px, 90vw)",
        background: "#1e1e1e",
        color: "#e6e6e6",
        border: "1px solid #2e2e2e",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.45)",
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    });
    selectordiv.appendChild(wrap);

    const selectlabel = document.createElement("label");
    selectlabel.textContent = "Velg klient:";
    Object.assign(selectlabel.style, {
        fontSize: "14px",
        color: "#b8b8b8",
        letterSpacing: "0.2px"
    });
    wrap.appendChild(selectlabel);

    const selectelement = document.createElement("select");
    selectelement.id = "clientselect";
    selectlabel.htmlFor = "clientselect";
    Object.assign(selectelement.style, {
        width: "100%",
        padding: "10px 12px",
        borderRadius: "10px",
        backgroundColor: "#2a2a2a",
        color: "#f2f2f2",
        border: "1px solid #3a3a3a",
        fontSize: "15px",
        outline: "none",
        transition: "box-shadow 160ms ease, border-color 160ms ease"
    });
    selectelement.addEventListener("focus", () => {
        selectelement.style.borderColor = "#2C3AAE";
        selectelement.style.boxShadow = "0 0 0 4px rgba(44,58,174,0.25)";
    });
    selectelement.addEventListener("blur", () => {
        selectelement.style.borderColor = "#3a3a3a";
        selectelement.style.boxShadow = "none";
    });
    wrap.appendChild(selectelement);

    for (let i = 0; i < clientIdlist.length; i++) {
        const option = document.createElement("option");
        option.value = clientIdlist[i];
        option.textContent = clientNamelist[i];
        selectelement.appendChild(option);
    }

    const selectbutton = document.createElement("button");
    selectbutton.textContent = "Velg";
    Object.assign(selectbutton.style, {
        background: "#2C3AAE", // din blåfarge 💙
        border: "none",
        color: "#fff",
        fontWeight: "700",
        fontSize: "14px",
        padding: "12px 14px",
        borderRadius: "10px",
        cursor: "pointer",
        width: "100%",
        transition: "transform 160ms ease, box-shadow 160ms ease, filter 160ms ease"
    });
    selectbutton.addEventListener("mouseenter", () => {
        selectbutton.style.transform = "translateY(-2px)";
        selectbutton.style.boxShadow = "0 6px 18px rgba(44,58,174,0.4)";
        selectbutton.style.filter = "brightness(1.1)";
    });
    selectbutton.addEventListener("mouseleave", () => {
        selectbutton.style.transform = "translateY(0)";
        selectbutton.style.boxShadow = "none";
        selectbutton.style.filter = "none";
    });

    selectbutton.onclick = function () {
        const selectedclientid = document.getElementById("clientselect").value;
        downloadclientObject(selectedclientid);
        selectordiv.style.display = "none";
    };
    wrap.appendChild(selectbutton);
}







function downloadclientObject(clientid){
    airtableGet("appcHyn9YLhSAgX0C","tbleBGTuZ9zvquwuc",clientid,"responsgetClient");
}

function responsgetClient(data,id){
 //lagre
   localStorage.setItem("clientobject", JSON.stringify(data.fields));  
   updateClientdata();  

   downloadcompanylist(data.fields.airtable);

 
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
