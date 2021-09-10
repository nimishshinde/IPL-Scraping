// let url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/delhi-capitals-vs-mumbai-indians-final-1237181/full-scorecard";
let cheerio = require("cheerio");
let request = require("request");
let fs = require("fs");
let path = require("path");
let xlsx = require("xlsx");


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
            
            //checking if the table contains batmans name... 
            if(numberofTds.length == 8){

                // if table contain 8 col then it is row of batmans .. so taking name out..
                let playerName = searchTool(numberofTds[0]).text();
                // console.log(playerName);
                let runs = searchTool(numberofTds[2]).text();
                let balls = searchTool(numberofTds[3]).text();
                let fours = searchTool(numberofTds[5]).text();
                let sixes = searchTool(numberofTds[6]).text();
                // myTeamName	name	venue	date opponentTeamName	result	runs	balls	fours	sixes	sr
                console.log(playerName, "played for", teamName, "scored", runs, "in", balls, "balls" , "with ", fours, "fours and ", sixes, "sixes");
                // processPlayer(playerName, teamName, runs, balls, fours, sixes);
                processPlayer(playerName, teamName, runs, balls, fours, sixes);
            }
        }
        console.log("```````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````` ");
    }
    
}

function processPlayer(playerName, teamName, runs, balls, fours, sixes){
    let obj = {
        playerName,
        teamName,
        runs,
        balls,
        fours,
        sixes
    }

    let dirPath  = path.join(__dirname, teamName);

    //checking the folder already exists or not ... 
    if(fs.existsSync(dirPath) == false){
        fs.mkdirSync(dirPath);
    }

    let playerFilePath = path.join(dirPath, playerName+".xlsx");
    let playerArray = [];
    if(fs.existsSync (playerFilePath ) == false){
        playerArray.push(obj);
    }else{
        //append -> data on the existing files..
        playerArray =   excelReader(playerFilePath);
        playerArray.push(obj);
    }
    //write in the files
    excelWriter(playerFilePath, playerArray, playerName);


}

// function getContent(playerFilePath){    
//     let content = fs.readFileSync(playerFilePath);
//     return JSON.parse(content);
// }

// function writeContent(playerFilePath, content){
//     let jsonData = JSON.stringify(content);
//     fs.writeFileSync(playerFilePath, jsonData);
// }

function excelReader(filePath, sheetName){
        let wb = xlsx.readFile(filePath);
            //wb --> work Book 

        let excelData = wb.Sheets[sheetName];
            // get data from a particular sheet in that wb

        let ans = xlsx.utils.sheet_to_json(excelData);
            //sheet to Json
        return ans;
}

function excelWriter(filePath, json, sheetName){
    let newWB = xlsx.utils.book_new();
        // workbook 

    let newWS = xlsx.utils.json_to_sheet(json);
        //workSheet 

    xlsx.utils.book_append_sheet(newWB, newWS, sheetName);

    xlsx.writeFile(newWB, filePath);
        //excel file create.. 
}


module.exports = {
    getUrl
}
