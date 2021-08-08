// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let cheerio = require("cheerio");
let request = require("request");

function getUrl(url){
    request(url,cb);
}


function cb(error, response, html){
    if(error){
        console.log("error :", error)   
    }else if(response.statusCode == 404){
        console.log("Page not Found");
    }
    else{
        dataExtracter(html);
    }
}


function dataExtracter(html){
    //search tool
    let searchTool = cheerio.load(html);
    let bothInnArr = searchTool(".Collapsible");
    // console.log(bothInnArr);

    for(let i=0; i<bothInnArr.length; i++){
        let teamNameElem = searchTool(bothInnArr[i]).find("h5");
        let teamName = teamNameElem.text();

        teamName = teamName.split("INNINGS")[0];
        teamName = teamName.trim();

        let batManTableBodyAllRows = searchTool(bothInnArr[i]).find(".table.batsman tbody tr");
        // console.log(batManTableBodyAllRows);

        for(let j=0; j<batManTableBodyAllRows.length; j++){
            let numberofTds = searchTool(batManTableBodyAllRows[j]).find("td");
            
            if(numberofTds.length == 8){
                let playerName = searchTool(numberofTds[0]).text();
                console.log(playerName);
            }
        }
        console.log("`````````````````````````````````````");
    }
    
}

module.exports = {
    getUrl
}






















































/*
let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
    console.log(fullAllMatchPageLink);

    request(fullAllMatchPageLink, allMatchPageCb);
*/