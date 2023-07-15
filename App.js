const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgval) => {
    let temp = tempVal.replace("{%tempval%}", parseInt(orgval.main.temp - 273));
    temp = temp.replace("{%tempmin%}", parseInt(orgval.main.temp_min - 273));
    temp = temp.replace("{%tempmax%}", parseInt(orgval.main.temp_max - 273));
    temp = temp.replace("{%location%}", orgval.name);
    temp = temp.replace("{%country%}", orgval.sys.country);
    temp = temp.replace("{%tempstatus%}", orgval.weather[0].main);
    return temp;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Ghaziabad&appid=431828870cbebe8a263a6f68fe1347f5")
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                //console.log(arrdata[0].main.temp-273);
                const realtimeData = arrdata.map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realtimeData);
            })
            .on("end", (err) => {
                if (err)
                    return console.log("Connection loses due to err", err);
                res.end();
            })
    } else {
        res.end("File not Found");
    }
});
server.listen(8000, "127.0.0.1");