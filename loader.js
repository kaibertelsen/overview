function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(`Failed to load script: ${url}`);
        document.head.appendChild(script);
    });
}

// Liste over CDN-URL-er som skal lastes inn
const cdnScripts = [
    "https://kaibertelsen.github.io/overview/projectsinelpages.js",
    "https://kaibertelsen.github.io/overview/projectsinelpages-p2.js",
     "https://kaibertelsen.github.io/overview/startup.js"
    
];

// Laste inn alle skriptene sekvensielt
cdnScripts.reduce((promise, script) => {
    return promise.then(() => loadScript(script));
}, Promise.resolve()).then(() => {
    console.log("All scripts loaded");

    //startloadingscreen();

    //sette dato til siste i forrige mnd
    ontrackMonitoring = findlastdateinpreviousmonth();

    MemberStack.onReady.then(function(member) {

            if (member.loggedIn){
        console.log("logget inn");
        document.getElementById("logginnview").style.display = "none";
        userStartupfirstTime(member.airtable);
        }else{
        document.getElementById("logginnview").style.display = "flex";
        console.log("ikke innlogget");
        }
    
    });




}).catch(error => {
    console.error(error);
});

