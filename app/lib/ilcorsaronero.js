//My API for ilcorsaronero.org
var request = require('request');
var cheerio = require('cheerio');


function search(term, cat, callback) {
    if (typeof term !== 'string') {
        callback(new Error("You must enter a string to search."));
        return;
    }
    scrape("http://ilcorsaronero.info/argh.php?search=" + encodeURIComponent(term), cat, callback);
}

function getMagnet(url, callback) {
    request(url, function (error, response, body) {
        if (!error) {
            var $2 = cheerio.load(body);
            var link = $2('.magnet').attr('href');
            callback(null, link);
        }
        else {
            callback("error", null)
        }
    })
}

function scrape(url, cat, callback) {
    if (typeof callback === 'undefined' && typeof cat !== 'function') {
        console.log("Missing callback function.");
        return;
    }

    request(url, function (error, response, body) {
        var result = [];
        var counter = 0;
        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(body);
            items = $('.odd, .odd2').filter(function () {
                if ($(this).children('td').eq(0).children('a').text() === cat) {
                    var r = $(this).children('td').eq(2).text();
                    var s = r;
                    var str = s;
                    s = s.substring(0, s.length - 2);
                    b = str.substring(str.length - 2, str.length);
                    s = parseFloat(s);
                    if (b === "GB" && s > 1.5 && s < 10) {
                        return true;
                    }
                    else return false;
                }
                else return false;
            });

            if (counter == items.length) {
                //console.log(result)

                callback(null, result);
            }
            items.each(function (i, row) {
                var catScraped = $(row).children('td').eq(0).children('a').text(),
                    name = $(this).children('td').eq(1).children('a').text(),
                    link = $(row).children('td').eq(1).children('a').attr("href"),
                    size = $(row).children('td').eq(2).text(),
                    date = $(row).children('td').eq(4).text(),
                    seeds = $(row).children('td').eq(5).text(),
                    peers = $(row).children('td').eq(6).text();
                //console.log(i);
                result.push({
                    "cat": catScraped,
                    "name": name,
                    "link": link,
                    "size": size,
                    "date": date,
                    "seeds": seeds,
                    "peers": peers
                });

                counter++;
                if (counter == items.length) {
                    //console.log(result)
                    callback(null, result);
                }
            });


        }
        else {
            callback('error', null);
        }
    })

}

exports.search = search;
exports.getMagnet = getMagnet;
