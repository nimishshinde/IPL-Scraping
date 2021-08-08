const { load } = require("cheerio");
let cheerio = require("cheerio");
let request = require("request");
let scorecardObj = require("./scorecard.js");

let inputUrl = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(inputUrl, cb);

//requesting on given url
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

// exracting the view call match link
function dataExtracter(html){
    //search tool
    let searchTool = cheerio.load(html);
    let anchorrep = searchTool('a[data-hover="View All Results"]');
    let link = anchorrep.attr("href");
    let fullAllMatchPageLink = `https://www.espncricinfo.com${link}`;
    console.log(fullAllMatchPageLink);

    request(fullAllMatchPageLink, allMatchPageCb);
}

//call back funtion for dataExtracter..
function allMatchPageCb(error, response, html){
    if(error){
        console.log("error :", error)   
    }else if(response.statusCode == 404){
        console.log("Page not Found");
    }
    else{
        getAllScoreCardLink(html);
    }
}

//extracring scorecard link for the view call matches
function getAllScoreCardLink(html){
    let searchTool1 = cheerio.load(html);
    let scorecardArr = searchTool1("a[data-hover='Scorecard']");
    for(let i=0; i<scorecardArr.length; i++){
        let linkScorecard = searchTool1(scorecardArr[i]).attr("href");
        let fullScorecardPath = `https://www.espncricinfo.com${linkScorecard}`;
        console.log(fullScorecardPath);

        scorecardObj.getUrl(fullScorecardPath);
    }

}