

var palettes = ["B81414", "DA8035", "003B00", "0C6F6F"]
var light = ["208383", "2BAE"]


var light = ["FB6C73", "C4000E", "5ACF5A", "45A0A0", "7D56B3", "5F5FB8", "910000", "079107", "0D0D65"]
var dark = ["9100", "079107", "2d-762", "0D0D65"]

var flat = ["c0392b", "8e44ad", "f39c12", "1abc9c", "d35400", "2980b9", "e74c3c", "2c3e50", "2ecc71", "f1c40f", "ecf0f1", "16a085", "7f8c8d"]
var fontsize = 20

// from 6 - 30 missing a couple numbers from 19-30 so look at the chart before setting font size
var fontconverter = {6:8, 7:9, 8:11, 9:12, 10:13, 11:15, 12:16, 13:18, 14:19, 15:21, 16:22, 17:23, 18:24, 19 : 25, 20:26, 22:29, 24:32, 26:35, 27:36, 29:38, 30:40 }
 
/*
    titles = ["Coffee", "Bubble Tea", "Water", "Milk"]
    data = [1200, 90, 100, 40]
*/


// pie chart creator
var d3piecharts = function (data, id_key){
  var myPie = new d3pie(id_key,data);
}



// Static with pure Canvas- No animation
// id should have hashtage appended to it? // Static with pure Canvas- No animation
// id should have hashtage appended to it? 
var makeHorizontalBars = function (array,topTitle, id) {
    // get data
    // this is HARDCODED dummy data: 
    // THIS SHOULD BE REMOVED WHEN THE DATA STRUCTURE OF THE INPUT IS FINALIZED
    if (array == 1)
        array = {"Title":"Reservations By Status","Items":[{"Key":"??","Value":53703},{"Key":"Reserved for y Clients... YUMM","Value":5297},{"Key":"Cancelled","Value":3287},{"Key":"Blocked","Value":32},{"Key":"","Value":28}]}
    var data = array["Items"]
    if (topTitle == 1)
         topTitle = array["Title"]
    var n = data.length

    
    // set up the container properties
    var container = document.getElementById(id);
    var canvas = document.createElement('canvas');

    // set width and height of canvas 

    // if there are too many bars (like reasonable 20) -> make taller, 
    //else if its too much data... this is not the right graph to use
    canvas.width = 1000;
    canvas.height = 500;
    
    if (n > 20) {
        canvas.width = 1000;
        canvas.height = 800;
    }

  
    id = "#" + id
    $(id)[0].width = 1000
    $(id)[0].height = canvas.height
    
    var totalW = $(id)[0].width
    var totalH = $(id)[0].height
    var ctx = canvas.getContext("2d")

    // fill with white so things arent completely blacked out 
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillRect(0,0,totalW,totalW);
    //

    var linewidth = 5;

    
    
    var total = 0
    
    var spacing = totalH / 6 / n;
    var startX = linewidth + 400; // line width and space for text //maxTitleLength*10
    var startY = 10-spacing/2 + 50; // + 50 to account for title
    var graphH = (totalH - 2*linewidth - n*spacing) // may want to consider shortening total height for room for 
    var graphW = totalW - 2*linewidth - 100 // for end space for number and percentage
    var barlength = (totalW - 600) / data[0]["Value"] //maxTitleLength*10


    for (var i = 0; i < data.length; i++) {
        total += data[i]["Value"];
    }

    /* shifting by converting points from pixels... is not easy... default to 20 fontsize 
    var maxTitleLength = 0
    // calculate total for percentage analysis
    // also get longest category
    for (var i = 0; i < data.length; i++) {
        if (data[i]["Key"].length > maxTitleLength){
            maxTitleLength = data[i]["Key"].length;
        }
        
        total += data[i]["Value"];
    }

    //startX = maxTitleLength*fontsize*fontsize/fontconverter[fontsize];

    // this code assumes that data is sorted from max to min which it seems it is. 
    //console.log(data[0]["Value"])
    */


   

    //drawAxis(ctx,linewidth)
    ctx.moveTo(startX-linewidth/2, startY); // divide by two because line width seems to take 2x the linewidth
    ctx.lineTo(startX - linewidth / 2, graphH + spacing * 3 / 2);
    ctx.lineWidth = linewidth;
    ctx.stroke();

    ctx.moveTo(startX - linewidth, graphH + spacing * 3 / 2);
    ctx.lineTo(totalW, graphH + spacing*3/2);
    ctx.lineWidth = linewidth;
    ctx.stroke();
   

    //draw Title 
    ctx.textAlign = "center";
    ctx.font = "bold " +fontsize+"px Arial Black";
    ctx.fillStyle = '#000000';
    ctx.fillText(topTitle , (totalW+startX)/2, 25);
  
    var h = (graphH - startY - spacing*n) / n;
    //console.log(totalH, graphH,n, h);
    var w = graphW / n + startX;
   
  
    startY += spacing;
    var m = 0;
    while (m < n) {
        ctx.fillStyle = "#" + light[m%light.length]
        //console.log(ctx.fillStyle)
        var w = data[m]["Value"]
        ctx.fillRect(startX, startY, barlength * w, h);
        ctx.font = fontsize+"px Arial";
        ctx.textAlign = "right";
        //ctx.fillStyle = '#000000';
        ctx.fillText(data[m]["Key"], startX - linewidth * 2, startY+h/2 + fontsize/4);
        ctx.textAlign = "left";
        ctx.fillText(w + " || " + percent (w, total) , startX + barlength*w + 10, startY+h/2+fontsize/4);// - half of font size
        //startX += w;
        startY += h + spacing;
        m += 1;
    }

    //var canvasURL = canvas.toDataURL("image/jpeg", 1);
    var canvasURL = canvas.toDataURL("image/jpeg", 0.75);
    var newGraph = document.createElement("img");
    newGraph.src = canvasURL;

    container.appendChild(newGraph);
}
var percent = function (n, total) {
    var percent = Math.round(n / total * 1000)/100;
    return percent + "%"
}

var getMonth_Date_Year  = function (date_object){
    return date_object.getMonth() + " " + date_object.getDate() + " " + date_object.getYear()
}

// array is the array with all the json data 
// do we have time
/* Adapted from http://bl.ocks.org/mbostock/3883245 */
var makeSingleLineGraph = function (array, keys, id){
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":4},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67},{"Key":"3/23/2010 12:00:00 AM","Value":57},{"Key":"3/24/2010 12:00:00 AM","Value":69},{"Key":"3/25/2010 12:00:00 AM","Value":51},{"Key":"3/26/2010 12:00:00 AM","Value":16},{"Key":"3/29/2010 12:00:00 AM","Value":1},{"Key":"3/31/2010 12:00:00 AM","Value":5},{"Key":"4/1/2010 12:00:00 AM","Value":5},{"Key":"4/2/2010 12:00:00 AM","Value":5},{"Key":"4/4/2010 12:00:00 AM","Value":11},{"Key":"4/5/2010 12:00:00 AM","Value":52},{"Key":"4/6/2010 12:00:00 AM","Value":54},{"Key":"4/7/2010 12:00:00 AM","Value":59},{"Key":"4/8/2010 12:00:00 AM","Value":55},{"Key":"4/9/2010 12:00:00 AM","Value":37},{"Key":"4/10/2010 12:00:00 AM","Value":10},{"Key":"4/11/2010 12:00:00 AM","Value":29},{"Key":"4/12/2010 12:00:00 AM","Value":60},{"Key":"4/13/2010 12:00:00 AM","Value":56},{"Key":"4/14/2010 12:00:00 AM","Value":60},{"Key":"4/15/2010 12:00:00 AM","Value":48},{"Key":"4/16/2010 12:00:00 AM","Value":33},{"Key":"4/17/2010 12:00:00 AM","Value":17},{"Key":"4/18/2010 12:00:00 AM","Value":35},{"Key":"4/19/2010 12:00:00 AM","Value":60},{"Key":"4/20/2010 12:00:00 AM","Value":50},{"Key":"4/21/2010 12:00:00 AM","Value":63},{"Key":"4/22/2010 12:00:00 AM","Value":58},{"Key":"4/23/2010 12:00:00 AM","Value":31},{"Key":"4/24/2010 12:00:00 AM","Value":9},{"Key":"4/25/2010 12:00:00 AM","Value":32},{"Key":"4/26/2010 12:00:00 AM","Value":66},{"Key":"4/27/2010 12:00:00 AM","Value":44},{"Key":"4/28/2010 12:00:00 AM","Value":58},{"Key":"4/29/2010 12:00:00 AM","Value":55},{"Key":"4/30/2010 12:00:00 AM","Value":30},{"Key":"5/1/2010 12:00:00 AM","Value":12},{"Key":"5/2/2010 12:00:00 AM","Value":33},{"Key":"5/3/2010 12:00:00 AM","Value":55},{"Key":"5/4/2010 12:00:00 AM","Value":61},{"Key":"5/5/2010 12:00:00 AM","Value":59},{"Key":"5/6/2010 12:00:00 AM","Value":54},{"Key":"5/7/2010 12:00:00 AM","Value":42},{"Key":"5/8/2010 12:00:00 AM","Value":34},{"Key":"5/9/2010 12:00:00 AM","Value":43},{"Key":"5/10/2010 12:00:00 AM","Value":58},{"Key":"5/11/2010 12:00:00 AM","Value":48},{"Key":"5/12/2010 12:00:00 AM","Value":48},{"Key":"5/13/2010 12:00:00 AM","Value":46},{"Key":"5/14/2010 12:00:00 AM","Value":34},{"Key":"5/15/2010 12:00:00 AM","Value":30},{"Key":"5/16/2010 12:00:00 AM","Value":44},{"Key":"5/17/2010 12:00:00 AM","Value":46},{"Key":"5/18/2010 12:00:00 AM","Value":15},{"Key":"5/19/2010 12:00:00 AM","Value":1},{"Key":"5/20/2010 12:00:00 AM","Value":1},{"Key":"5/24/2010 12:00:00 AM","Value":1},{"Key":"5/26/2010 12:00:00 AM","Value":1},{"Key":"5/28/2010 12:00:00 AM","Value":1},{"Key":"6/1/2010 12:00:00 AM","Value":7},{"Key":"6/2/2010 12:00:00 AM","Value":8},{"Key":"6/3/2010 12:00:00 AM","Value":7},{"Key":"6/4/2010 12:00:00 AM","Value":2},{"Key":"6/7/2010 12:00:00 AM","Value":13},{"Key":"6/8/2010 12:00:00 AM","Value":8},{"Key":"6/9/2010 12:00:00 AM","Value":12},{"Key":"6/10/2010 12:00:00 AM","Value":15},{"Key":"6/11/2010 12:00:00 AM","Value":6},{"Key":"6/14/2010 12:00:00 AM","Value":18},{"Key":"6/15/2010 12:00:00 AM","Value":14},{"Key":"6/16/2010 12:00:00 AM","Value":10},{"Key":"6/17/2010 12:00:00 AM","Value":13},{"Key":"6/18/2010 12:00:00 AM","Value":5},{"Key":"6/21/2010 12:00:00 AM","Value":14},{"Key":"6/22/2010 12:00:00 AM","Value":20},{"Key":"6/23/2010 12:00:00 AM","Value":10},{"Key":"6/24/2010 12:00:00 AM","Value":22},{"Key":"6/25/2010 12:00:00 AM","Value":2},{"Key":"6/28/2010 12:00:00 AM","Value":19},{"Key":"6/29/2010 12:00:00 AM","Value":8},{"Key":"6/30/2010 12:00:00 AM","Value":23},{"Key":"7/1/2010 12:00:00 AM","Value":17},{"Key":"7/2/2010 12:00:00 AM","Value":10},{"Key":"7/6/2010 12:00:00 AM","Value":21},{"Key":"7/7/2010 12:00:00 AM","Value":36},{"Key":"7/8/2010 12:00:00 AM","Value":19},{"Key":"7/9/2010 12:00:00 AM","Value":10},{"Key":"7/12/2010 12:00:00 AM","Value":28},{"Key":"7/13/2010 12:00:00 AM","Value":9},{"Key":"7/14/2010 12:00:00 AM","Value":5},{"Key":"7/15/2010 12:00:00 AM","Value":8},{"Key":"7/16/2010 12:00:00 AM","Value":4},{"Key":"7/19/2010 12:00:00 AM","Value":15},{"Key":"7/20/2010 12:00:00 AM","Value":17},{"Key":"7/21/2010 12:00:00 AM","Value":14},{"Key":"7/22/2010 12:00:00 AM","Value":25},{"Key":"7/23/2010 12:00:00 AM","Value":4},{"Key":"7/26/2010 12:00:00 AM","Value":17},{"Key":"7/27/2010 12:00:00 AM","Value":22},{"Key":"7/28/2010 12:00:00 AM","Value":22},{"Key":"7/29/2010 12:00:00 AM","Value":20},{"Key":"7/30/2010 12:00:00 AM","Value":5},{"Key":"8/2/2010 12:00:00 AM","Value":18},{"Key":"8/3/2010 12:00:00 AM","Value":20},{"Key":"8/4/2010 12:00:00 AM","Value":14},{"Key":"8/5/2010 12:00:00 AM","Value":28},{"Key":"8/6/2010 12:00:00 AM","Value":4},{"Key":"8/9/2010 12:00:00 AM","Value":18},{"Key":"8/10/2010 12:00:00 AM","Value":17},{"Key":"8/11/2010 12:00:00 AM","Value":16},{"Key":"8/12/2010 12:00:00 AM","Value":27},{"Key":"8/13/2010 12:00:00 AM","Value":10},{"Key":"8/16/2010 12:00:00 AM","Value":21},{"Key":"8/17/2010 12:00:00 AM","Value":24},{"Key":"8/18/2010 12:00:00 AM","Value":25},{"Key":"8/19/2010 12:00:00 AM","Value":24},{"Key":"8/20/2010 12:00:00 AM","Value":8},{"Key":"8/23/2010 12:00:00 AM","Value":4},{"Key":"8/24/2010 12:00:00 AM","Value":6},{"Key":"8/25/2010 12:00:00 AM","Value":9},{"Key":"8/26/2010 12:00:00 AM","Value":8},{"Key":"8/27/2010 12:00:00 AM","Value":13},{"Key":"8/29/2010 12:00:00 AM","Value":3},{"Key":"8/30/2010 12:00:00 AM","Value":42},{"Key":"8/31/2010 12:00:00 AM","Value":40},{"Key":"9/1/2010 12:00:00 AM","Value":49},{"Key":"9/2/2010 12:00:00 AM","Value":34},{"Key":"9/3/2010 12:00:00 AM","Value":32},{"Key":"9/4/2010 12:00:00 AM","Value":8},{"Key":"9/5/2010 12:00:00 AM","Value":13},{"Key":"9/6/2010 12:00:00 AM","Value":1},{"Key":"9/7/2010 12:00:00 AM","Value":52},{"Key":"9/8/2010 12:00:00 AM","Value":40},{"Key":"9/9/2010 12:00:00 AM","Value":16},{"Key":"9/10/2010 12:00:00 AM","Value":15},{"Key":"9/11/2010 12:00:00 AM","Value":5},{"Key":"9/12/2010 12:00:00 AM","Value":20},{"Key":"9/13/2010 12:00:00 AM","Value":63},{"Key":"9/14/2010 12:00:00 AM","Value":44},{"Key":"9/15/2010 12:00:00 AM","Value":54},{"Key":"9/16/2010 12:00:00 AM","Value":54},{"Key":"9/17/2010 12:00:00 AM","Value":32},{"Key":"9/18/2010 12:00:00 AM","Value":18},{"Key":"9/19/2010 12:00:00 AM","Value":30},{"Key":"9/20/2010 12:00:00 AM","Value":63},{"Key":"9/21/2010 12:00:00 AM","Value":60},{"Key":"9/22/2010 12:00:00 AM","Value":68},{"Key":"9/23/2010 12:00:00 AM","Value":57},{"Key":"9/24/2010 12:00:00 AM","Value":39},{"Key":"9/25/2010 12:00:00 AM","Value":17},{"Key":"9/26/2010 12:00:00 AM","Value":38},{"Key":"9/27/2010 12:00:00 AM","Value":69},{"Key":"9/28/2010 12:00:00 AM","Value":75},{"Key":"9/29/2010 12:00:00 AM","Value":80},{"Key":"9/30/2010 12:00:00 AM","Value":64},{"Key":"10/1/2010 12:00:00 AM","Value":39},{"Key":"10/2/2010 12:00:00 AM","Value":19},{"Key":"10/3/2010 12:00:00 AM","Value":42},{"Key":"10/4/2010 12:00:00 AM","Value":73},{"Key":"10/5/2010 12:00:00 AM","Value":65},{"Key":"10/6/2010 12:00:00 AM","Value":73},{"Key":"10/7/2010 12:00:00 AM","Value":46},{"Key":"10/8/2010 12:00:00 AM","Value":29},{"Key":"10/9/2010 12:00:00 AM","Value":8},{"Key":"10/10/2010 12:00:00 AM","Value":24},{"Key":"10/11/2010 12:00:00 AM","Value":67},{"Key":"10/12/2010 12:00:00 AM","Value":63},{"Key":"10/13/2010 12:00:00 AM","Value":78},{"Key":"10/14/2010 12:00:00 AM","Value":69},{"Key":"10/15/2010 12:00:00 AM","Value":37},{"Key":"10/16/2010 12:00:00 AM","Value":24},{"Key":"10/17/2010 12:00:00 AM","Value":43},{"Key":"10/18/2010 12:00:00 AM","Value":74},{"Key":"10/19/2010 12:00:00 AM","Value":75},{"Key":"10/20/2010 12:00:00 AM","Value":76},{"Key":"10/21/2010 12:00:00 AM","Value":73},{"Key":"10/22/2010 12:00:00 AM","Value":33},{"Key":"10/23/2010 12:00:00 AM","Value":20},{"Key":"10/24/2010 12:00:00 AM","Value":39},{"Key":"10/25/2010 12:00:00 AM","Value":60},{"Key":"10/26/2010 12:00:00 AM","Value":65},{"Key":"10/27/2010 12:00:00 AM","Value":76},{"Key":"10/28/2010 12:00:00 AM","Value":64},{"Key":"10/29/2010 12:00:00 AM","Value":34},{"Key":"10/30/2010 12:00:00 AM","Value":18},{"Key":"10/31/2010 12:00:00 AM","Value":34},{"Key":"11/1/2010 12:00:00 AM","Value":66},{"Key":"11/2/2010 12:00:00 AM","Value":65},{"Key":"11/3/2010 12:00:00 AM","Value":73},{"Key":"11/4/2010 12:00:00 AM","Value":57},{"Key":"11/5/2010 12:00:00 AM","Value":39},{"Key":"11/6/2010 12:00:00 AM","Value":23},{"Key":"11/7/2010 12:00:00 AM","Value":31},{"Key":"11/8/2010 12:00:00 AM","Value":65},{"Key":"11/9/2010 12:00:00 AM","Value":63},{"Key":"11/10/2010 12:00:00 AM","Value":85},{"Key":"11/11/2010 12:00:00 AM","Value":70},{"Key":"11/12/2010 12:00:00 AM","Value":41},{"Key":"11/13/2010 12:00:00 AM","Value":20},{"Key":"11/14/2010 12:00:00 AM","Value":32},{"Key":"11/15/2010 12:00:00 AM","Value":59},{"Key":"11/16/2010 12:00:00 AM","Value":65},{"Key":"11/17/2010 12:00:00 AM","Value":65},{"Key":"11/18/2010 12:00:00 AM","Value":56},{"Key":"11/19/2010 12:00:00 AM","Value":35},{"Key":"11/20/2010 12:00:00 AM","Value":19},{"Key":"11/21/2010 12:00:00 AM","Value":35},{"Key":"11/22/2010 12:00:00 AM","Value":58},{"Key":"11/23/2010 12:00:00 AM","Value":50},{"Key":"11/24/2010 12:00:00 AM","Value":14},{"Key":"11/28/2010 12:00:00 AM","Value":25},{"Key":"11/29/2010 12:00:00 AM","Value":62},{"Key":"11/30/2010 12:00:00 AM","Value":69},{"Key":"12/1/2010 12:00:00 AM","Value":73},{"Key":"12/2/2010 12:00:00 AM","Value":67},{"Key":"12/3/2010 12:00:00 AM","Value":39},{"Key":"12/4/2010 12:00:00 AM","Value":24},{"Key":"12/5/2010 12:00:00 AM","Value":39},{"Key":"12/6/2010 12:00:00 AM","Value":66},{"Key":"12/7/2010 12:00:00 AM","Value":69},{"Key":"12/8/2010 12:00:00 AM","Value":69},{"Key":"12/9/2010 12:00:00 AM","Value":60},{"Key":"12/10/2010 12:00:00 AM","Value":57},{"Key":"12/11/2010 12:00:00 AM","Value":47},{"Key":"12/12/2010 12:00:00 AM","Value":51},{"Key":"12/13/2010 12:00:00 AM","Value":66},{"Key":"12/14/2010 12:00:00 AM","Value":58},{"Key":"12/15/2010 12:00:00 AM","Value":52},{"Key":"12/16/2010 12:00:00 AM","Value":54},{"Key":"12/17/2010 12:00:00 AM","Value":20},{"Key":"12/18/2010 12:00:00 AM","Value":5},{"Key":"12/19/2010 12:00:00 AM","Value":19},{"Key":"12/20/2010 12:00:00 AM","Value":15},{"Key":"1/3/2011 12:00:00 AM","Value":5},{"Key":"1/4/2011 12:00:00 AM","Value":8},{"Key":"1/5/2011 12:00:00 AM","Value":9},{"Key":"1/6/2011 12:00:00 AM","Value":5},{"Key":"1/7/2011 12:00:00 AM","Value":4},{"Key":"1/10/2011 12:00:00 AM","Value":7},{"Key":"1/11/2011 12:00:00 AM","Value":4},{"Key":"1/13/2011 12:00:00 AM","Value":3},{"Key":"1/14/2011 12:00:00 AM","Value":3},{"Key":"1/18/2011 12:00:00 AM","Value":6},{"Key":"1/19/2011 12:00:00 AM","Value":6},{"Key":"1/20/2011 12:00:00 AM","Value":4},{"Key":"1/21/2011 12:00:00 AM","Value":5},{"Key":"1/24/2011 12:00:00 AM","Value":2},{"Key":"1/25/2011 12:00:00 AM","Value":8},{"Key":"1/26/2011 12:00:00 AM","Value":2},{"Key":"1/27/2011 12:00:00 AM","Value":1},{"Key":"1/28/2011 12:00:00 AM","Value":7},{"Key":"1/31/2011 12:00:00 AM","Value":18},{"Key":"2/1/2011 12:00:00 AM","Value":31},{"Key":"2/2/2011 12:00:00 AM","Value":35},{"Key":"2/3/2011 12:00:00 AM","Value":34},{"Key":"2/4/2011 12:00:00 AM","Value":14},{"Key":"2/5/2011 12:00:00 AM","Value":14},{"Key":"2/6/2011 12:00:00 AM","Value":16},{"Key":"2/7/2011 12:00:00 AM","Value":64},{"Key":"2/8/2011 12:00:00 AM","Value":50}]}
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":124},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67}]}
    var data = array["Items"]
    var topTitle = array["Title"]

    var key = keys[0]; // the one line we want

    // number of elements in array
    //console.log(data.length);

    //var data_values = []
    //var data_keys = []
    // get max value
    var max = 0
    for (var i = 0; i < data.length; i++){
        if ( data[i]["Value"] > max ) {
            max = data[i]["Value"]
        }
        //data_values.push(data[i]["Value"]);
        //data_keys.push(data[i]["Key"]);
    }

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1000,
        height = 500;

    //console.log(data[0]["Key"])
    //console.log(new Date(data[0]["Key"]))
    //console.log(getMonth_Date_Year (new Date(data[0]["Key"])))

    var x = d3.time.scale()
        //.domain([getMonth_Date_Year (new Date(data[0]["Key"])),getMonth_Date_Year (new Date(data[data.length-1]["Key"])])
        //.domain([0, 5])
        .domain([new Date(data[0]["Key"]), d3.time.day.offset(new Date(data[data.length - 1]["Key"]), 1)])
        .range([0, 1000]); // data.length

    var y = d3.scale.linear()
        .domain([0, max+5]) // $0 to $80
        .range([height, 0]); // svg = y-down // data[0]["Value"]

    //x.domain (d3.extent(data, function(d) { return d["Key"]; }));
    //y.domain (d3.extent(data, function(d) { return d["Value"]; }));


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");


 

   var svg = d3.select("#" + id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );


   

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(0,"+ -5 +")")
      .attr("x", width)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Time and Date");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Reservations");



   var i = 0;
    var line = d3.svg.line()
        .x(function(d) { i +=1;return x(i);} ) // x(d)
        .y(function(d){return y(d["Value"]);}) //console.log(d["Value"]);

    svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
    
      i = 0;
    d3.selectAll(data).each (function(d,i){
     svg.append("circle")
        .datum(this)
        //.attr("cx",35)
        //.attr("cy",5)
        .attr("r", 2)
        .attr("cx", function(d) { return 20}) //dummy
        .attr("cy", function(d){return y(d["Value"])})
        .style("fill", "red") //dotcolor
        .on("mouseover", function(d){
           var circle = d3.select(this)
          
                var x = parseInt(circle[0][0].cx.baseVal.valueAsString) -1 + ""
                var y = parseInt(circle[0][0].cy.baseVal.valueAsString)  - 10 + "" 
                var group = d3.select(this.parentNode)
                .append("g")
                              
                if (d3.select("#text" + i)[0][0] != null){
                    d3.select("#text" + i)
                    .attr("class", "visible")
                    .attr("x", x)
                    .attr("y", y)
                }
                else{
                group
                .append("text")
                .attr("id", "text"+i)
                .attr("class", "visible")
                .attr("x", x)
                .attr("y", y)
                .text( d["Value"] )
                .style("fill", "red")//dotcolor
                .style("font-size","1.2em")
                }   
            })
            .on("mouseout", function(d){
                d3.select("#text"+i)
                .attr("class", "invisible")
            })
    });

}
// keys is the array with the key of what lines we want to plot
// for now we default to the original key
// has options to change colors <- single line graph uses hard coded css steel blue and red
var makeMultiLineGraph = function (alldata, keys, id){
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":4},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67},{"Key":"3/23/2010 12:00:00 AM","Value":57},{"Key":"3/24/2010 12:00:00 AM","Value":69},{"Key":"3/25/2010 12:00:00 AM","Value":51},{"Key":"3/26/2010 12:00:00 AM","Value":16},{"Key":"3/29/2010 12:00:00 AM","Value":1},{"Key":"3/31/2010 12:00:00 AM","Value":5},{"Key":"4/1/2010 12:00:00 AM","Value":5},{"Key":"4/2/2010 12:00:00 AM","Value":5},{"Key":"4/4/2010 12:00:00 AM","Value":11},{"Key":"4/5/2010 12:00:00 AM","Value":52},{"Key":"4/6/2010 12:00:00 AM","Value":54},{"Key":"4/7/2010 12:00:00 AM","Value":59},{"Key":"4/8/2010 12:00:00 AM","Value":55},{"Key":"4/9/2010 12:00:00 AM","Value":37},{"Key":"4/10/2010 12:00:00 AM","Value":10},{"Key":"4/11/2010 12:00:00 AM","Value":29},{"Key":"4/12/2010 12:00:00 AM","Value":60},{"Key":"4/13/2010 12:00:00 AM","Value":56},{"Key":"4/14/2010 12:00:00 AM","Value":60},{"Key":"4/15/2010 12:00:00 AM","Value":48},{"Key":"4/16/2010 12:00:00 AM","Value":33},{"Key":"4/17/2010 12:00:00 AM","Value":17},{"Key":"4/18/2010 12:00:00 AM","Value":35},{"Key":"4/19/2010 12:00:00 AM","Value":60},{"Key":"4/20/2010 12:00:00 AM","Value":50},{"Key":"4/21/2010 12:00:00 AM","Value":63},{"Key":"4/22/2010 12:00:00 AM","Value":58},{"Key":"4/23/2010 12:00:00 AM","Value":31},{"Key":"4/24/2010 12:00:00 AM","Value":9},{"Key":"4/25/2010 12:00:00 AM","Value":32},{"Key":"4/26/2010 12:00:00 AM","Value":66},{"Key":"4/27/2010 12:00:00 AM","Value":44},{"Key":"4/28/2010 12:00:00 AM","Value":58},{"Key":"4/29/2010 12:00:00 AM","Value":55},{"Key":"4/30/2010 12:00:00 AM","Value":30},{"Key":"5/1/2010 12:00:00 AM","Value":12},{"Key":"5/2/2010 12:00:00 AM","Value":33},{"Key":"5/3/2010 12:00:00 AM","Value":55},{"Key":"5/4/2010 12:00:00 AM","Value":61},{"Key":"5/5/2010 12:00:00 AM","Value":59},{"Key":"5/6/2010 12:00:00 AM","Value":54},{"Key":"5/7/2010 12:00:00 AM","Value":42},{"Key":"5/8/2010 12:00:00 AM","Value":34},{"Key":"5/9/2010 12:00:00 AM","Value":43},{"Key":"5/10/2010 12:00:00 AM","Value":58},{"Key":"5/11/2010 12:00:00 AM","Value":48},{"Key":"5/12/2010 12:00:00 AM","Value":48},{"Key":"5/13/2010 12:00:00 AM","Value":46},{"Key":"5/14/2010 12:00:00 AM","Value":34},{"Key":"5/15/2010 12:00:00 AM","Value":30},{"Key":"5/16/2010 12:00:00 AM","Value":44},{"Key":"5/17/2010 12:00:00 AM","Value":46},{"Key":"5/18/2010 12:00:00 AM","Value":15},{"Key":"5/19/2010 12:00:00 AM","Value":1},{"Key":"5/20/2010 12:00:00 AM","Value":1},{"Key":"5/24/2010 12:00:00 AM","Value":1},{"Key":"5/26/2010 12:00:00 AM","Value":1},{"Key":"5/28/2010 12:00:00 AM","Value":1},{"Key":"6/1/2010 12:00:00 AM","Value":7},{"Key":"6/2/2010 12:00:00 AM","Value":8},{"Key":"6/3/2010 12:00:00 AM","Value":7},{"Key":"6/4/2010 12:00:00 AM","Value":2},{"Key":"6/7/2010 12:00:00 AM","Value":13},{"Key":"6/8/2010 12:00:00 AM","Value":8},{"Key":"6/9/2010 12:00:00 AM","Value":12},{"Key":"6/10/2010 12:00:00 AM","Value":15},{"Key":"6/11/2010 12:00:00 AM","Value":6},{"Key":"6/14/2010 12:00:00 AM","Value":18},{"Key":"6/15/2010 12:00:00 AM","Value":14},{"Key":"6/16/2010 12:00:00 AM","Value":10},{"Key":"6/17/2010 12:00:00 AM","Value":13},{"Key":"6/18/2010 12:00:00 AM","Value":5},{"Key":"6/21/2010 12:00:00 AM","Value":14},{"Key":"6/22/2010 12:00:00 AM","Value":20},{"Key":"6/23/2010 12:00:00 AM","Value":10},{"Key":"6/24/2010 12:00:00 AM","Value":22},{"Key":"6/25/2010 12:00:00 AM","Value":2},{"Key":"6/28/2010 12:00:00 AM","Value":19},{"Key":"6/29/2010 12:00:00 AM","Value":8},{"Key":"6/30/2010 12:00:00 AM","Value":23},{"Key":"7/1/2010 12:00:00 AM","Value":17},{"Key":"7/2/2010 12:00:00 AM","Value":10},{"Key":"7/6/2010 12:00:00 AM","Value":21},{"Key":"7/7/2010 12:00:00 AM","Value":36},{"Key":"7/8/2010 12:00:00 AM","Value":19},{"Key":"7/9/2010 12:00:00 AM","Value":10},{"Key":"7/12/2010 12:00:00 AM","Value":28},{"Key":"7/13/2010 12:00:00 AM","Value":9},{"Key":"7/14/2010 12:00:00 AM","Value":5},{"Key":"7/15/2010 12:00:00 AM","Value":8},{"Key":"7/16/2010 12:00:00 AM","Value":4},{"Key":"7/19/2010 12:00:00 AM","Value":15},{"Key":"7/20/2010 12:00:00 AM","Value":17},{"Key":"7/21/2010 12:00:00 AM","Value":14},{"Key":"7/22/2010 12:00:00 AM","Value":25},{"Key":"7/23/2010 12:00:00 AM","Value":4},{"Key":"7/26/2010 12:00:00 AM","Value":17},{"Key":"7/27/2010 12:00:00 AM","Value":22},{"Key":"7/28/2010 12:00:00 AM","Value":22},{"Key":"7/29/2010 12:00:00 AM","Value":20},{"Key":"7/30/2010 12:00:00 AM","Value":5},{"Key":"8/2/2010 12:00:00 AM","Value":18},{"Key":"8/3/2010 12:00:00 AM","Value":20},{"Key":"8/4/2010 12:00:00 AM","Value":14},{"Key":"8/5/2010 12:00:00 AM","Value":28},{"Key":"8/6/2010 12:00:00 AM","Value":4},{"Key":"8/9/2010 12:00:00 AM","Value":18},{"Key":"8/10/2010 12:00:00 AM","Value":17},{"Key":"8/11/2010 12:00:00 AM","Value":16},{"Key":"8/12/2010 12:00:00 AM","Value":27},{"Key":"8/13/2010 12:00:00 AM","Value":10},{"Key":"8/16/2010 12:00:00 AM","Value":21},{"Key":"8/17/2010 12:00:00 AM","Value":24},{"Key":"8/18/2010 12:00:00 AM","Value":25},{"Key":"8/19/2010 12:00:00 AM","Value":24},{"Key":"8/20/2010 12:00:00 AM","Value":8},{"Key":"8/23/2010 12:00:00 AM","Value":4},{"Key":"8/24/2010 12:00:00 AM","Value":6},{"Key":"8/25/2010 12:00:00 AM","Value":9},{"Key":"8/26/2010 12:00:00 AM","Value":8},{"Key":"8/27/2010 12:00:00 AM","Value":13},{"Key":"8/29/2010 12:00:00 AM","Value":3},{"Key":"8/30/2010 12:00:00 AM","Value":42},{"Key":"8/31/2010 12:00:00 AM","Value":40},{"Key":"9/1/2010 12:00:00 AM","Value":49},{"Key":"9/2/2010 12:00:00 AM","Value":34},{"Key":"9/3/2010 12:00:00 AM","Value":32},{"Key":"9/4/2010 12:00:00 AM","Value":8},{"Key":"9/5/2010 12:00:00 AM","Value":13},{"Key":"9/6/2010 12:00:00 AM","Value":1},{"Key":"9/7/2010 12:00:00 AM","Value":52},{"Key":"9/8/2010 12:00:00 AM","Value":40},{"Key":"9/9/2010 12:00:00 AM","Value":16},{"Key":"9/10/2010 12:00:00 AM","Value":15},{"Key":"9/11/2010 12:00:00 AM","Value":5},{"Key":"9/12/2010 12:00:00 AM","Value":20},{"Key":"9/13/2010 12:00:00 AM","Value":63},{"Key":"9/14/2010 12:00:00 AM","Value":44},{"Key":"9/15/2010 12:00:00 AM","Value":54},{"Key":"9/16/2010 12:00:00 AM","Value":54},{"Key":"9/17/2010 12:00:00 AM","Value":32},{"Key":"9/18/2010 12:00:00 AM","Value":18},{"Key":"9/19/2010 12:00:00 AM","Value":30},{"Key":"9/20/2010 12:00:00 AM","Value":63},{"Key":"9/21/2010 12:00:00 AM","Value":60},{"Key":"9/22/2010 12:00:00 AM","Value":68},{"Key":"9/23/2010 12:00:00 AM","Value":57},{"Key":"9/24/2010 12:00:00 AM","Value":39},{"Key":"9/25/2010 12:00:00 AM","Value":17},{"Key":"9/26/2010 12:00:00 AM","Value":38},{"Key":"9/27/2010 12:00:00 AM","Value":69},{"Key":"9/28/2010 12:00:00 AM","Value":75},{"Key":"9/29/2010 12:00:00 AM","Value":80},{"Key":"9/30/2010 12:00:00 AM","Value":64},{"Key":"10/1/2010 12:00:00 AM","Value":39},{"Key":"10/2/2010 12:00:00 AM","Value":19},{"Key":"10/3/2010 12:00:00 AM","Value":42},{"Key":"10/4/2010 12:00:00 AM","Value":73},{"Key":"10/5/2010 12:00:00 AM","Value":65},{"Key":"10/6/2010 12:00:00 AM","Value":73},{"Key":"10/7/2010 12:00:00 AM","Value":46},{"Key":"10/8/2010 12:00:00 AM","Value":29},{"Key":"10/9/2010 12:00:00 AM","Value":8},{"Key":"10/10/2010 12:00:00 AM","Value":24},{"Key":"10/11/2010 12:00:00 AM","Value":67},{"Key":"10/12/2010 12:00:00 AM","Value":63},{"Key":"10/13/2010 12:00:00 AM","Value":78},{"Key":"10/14/2010 12:00:00 AM","Value":69},{"Key":"10/15/2010 12:00:00 AM","Value":37},{"Key":"10/16/2010 12:00:00 AM","Value":24},{"Key":"10/17/2010 12:00:00 AM","Value":43},{"Key":"10/18/2010 12:00:00 AM","Value":74},{"Key":"10/19/2010 12:00:00 AM","Value":75},{"Key":"10/20/2010 12:00:00 AM","Value":76},{"Key":"10/21/2010 12:00:00 AM","Value":73},{"Key":"10/22/2010 12:00:00 AM","Value":33},{"Key":"10/23/2010 12:00:00 AM","Value":20},{"Key":"10/24/2010 12:00:00 AM","Value":39},{"Key":"10/25/2010 12:00:00 AM","Value":60},{"Key":"10/26/2010 12:00:00 AM","Value":65},{"Key":"10/27/2010 12:00:00 AM","Value":76},{"Key":"10/28/2010 12:00:00 AM","Value":64},{"Key":"10/29/2010 12:00:00 AM","Value":34},{"Key":"10/30/2010 12:00:00 AM","Value":18},{"Key":"10/31/2010 12:00:00 AM","Value":34},{"Key":"11/1/2010 12:00:00 AM","Value":66},{"Key":"11/2/2010 12:00:00 AM","Value":65},{"Key":"11/3/2010 12:00:00 AM","Value":73},{"Key":"11/4/2010 12:00:00 AM","Value":57},{"Key":"11/5/2010 12:00:00 AM","Value":39},{"Key":"11/6/2010 12:00:00 AM","Value":23},{"Key":"11/7/2010 12:00:00 AM","Value":31},{"Key":"11/8/2010 12:00:00 AM","Value":65},{"Key":"11/9/2010 12:00:00 AM","Value":63},{"Key":"11/10/2010 12:00:00 AM","Value":85},{"Key":"11/11/2010 12:00:00 AM","Value":70},{"Key":"11/12/2010 12:00:00 AM","Value":41},{"Key":"11/13/2010 12:00:00 AM","Value":20},{"Key":"11/14/2010 12:00:00 AM","Value":32},{"Key":"11/15/2010 12:00:00 AM","Value":59},{"Key":"11/16/2010 12:00:00 AM","Value":65},{"Key":"11/17/2010 12:00:00 AM","Value":65},{"Key":"11/18/2010 12:00:00 AM","Value":56},{"Key":"11/19/2010 12:00:00 AM","Value":35},{"Key":"11/20/2010 12:00:00 AM","Value":19},{"Key":"11/21/2010 12:00:00 AM","Value":35},{"Key":"11/22/2010 12:00:00 AM","Value":58},{"Key":"11/23/2010 12:00:00 AM","Value":50},{"Key":"11/24/2010 12:00:00 AM","Value":14},{"Key":"11/28/2010 12:00:00 AM","Value":25},{"Key":"11/29/2010 12:00:00 AM","Value":62},{"Key":"11/30/2010 12:00:00 AM","Value":69},{"Key":"12/1/2010 12:00:00 AM","Value":73},{"Key":"12/2/2010 12:00:00 AM","Value":67},{"Key":"12/3/2010 12:00:00 AM","Value":39},{"Key":"12/4/2010 12:00:00 AM","Value":24},{"Key":"12/5/2010 12:00:00 AM","Value":39},{"Key":"12/6/2010 12:00:00 AM","Value":66},{"Key":"12/7/2010 12:00:00 AM","Value":69},{"Key":"12/8/2010 12:00:00 AM","Value":69},{"Key":"12/9/2010 12:00:00 AM","Value":60},{"Key":"12/10/2010 12:00:00 AM","Value":57},{"Key":"12/11/2010 12:00:00 AM","Value":47},{"Key":"12/12/2010 12:00:00 AM","Value":51},{"Key":"12/13/2010 12:00:00 AM","Value":66},{"Key":"12/14/2010 12:00:00 AM","Value":58},{"Key":"12/15/2010 12:00:00 AM","Value":52},{"Key":"12/16/2010 12:00:00 AM","Value":54},{"Key":"12/17/2010 12:00:00 AM","Value":20},{"Key":"12/18/2010 12:00:00 AM","Value":5},{"Key":"12/19/2010 12:00:00 AM","Value":19},{"Key":"12/20/2010 12:00:00 AM","Value":15},{"Key":"1/3/2011 12:00:00 AM","Value":5},{"Key":"1/4/2011 12:00:00 AM","Value":8},{"Key":"1/5/2011 12:00:00 AM","Value":9},{"Key":"1/6/2011 12:00:00 AM","Value":5},{"Key":"1/7/2011 12:00:00 AM","Value":4},{"Key":"1/10/2011 12:00:00 AM","Value":7},{"Key":"1/11/2011 12:00:00 AM","Value":4},{"Key":"1/13/2011 12:00:00 AM","Value":3},{"Key":"1/14/2011 12:00:00 AM","Value":3},{"Key":"1/18/2011 12:00:00 AM","Value":6},{"Key":"1/19/2011 12:00:00 AM","Value":6},{"Key":"1/20/2011 12:00:00 AM","Value":4},{"Key":"1/21/2011 12:00:00 AM","Value":5},{"Key":"1/24/2011 12:00:00 AM","Value":2},{"Key":"1/25/2011 12:00:00 AM","Value":8},{"Key":"1/26/2011 12:00:00 AM","Value":2},{"Key":"1/27/2011 12:00:00 AM","Value":1},{"Key":"1/28/2011 12:00:00 AM","Value":7},{"Key":"1/31/2011 12:00:00 AM","Value":18},{"Key":"2/1/2011 12:00:00 AM","Value":31},{"Key":"2/2/2011 12:00:00 AM","Value":35},{"Key":"2/3/2011 12:00:00 AM","Value":34},{"Key":"2/4/2011 12:00:00 AM","Value":14},{"Key":"2/5/2011 12:00:00 AM","Value":14},{"Key":"2/6/2011 12:00:00 AM","Value":16},{"Key":"2/7/2011 12:00:00 AM","Value":64},{"Key":"2/8/2011 12:00:00 AM","Value":50}]}
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":124},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67}]}
   
    array2 = {"Title":"Reservations By Date","Items":[{"Key":"11/23/2011 12:00:00 AM","Value":1},{"Key":"11/27/2011 12:00:00 AM","Value":21},{"Key":"11/28/2011 12:00:00 AM","Value":67},{"Key":"11/29/2011 12:00:00 AM","Value":63},{"Key":"11/30/2011 12:00:00 AM","Value":73},{"Key":"12/1/2011 12:00:00 AM","Value":55},{"Key":"12/2/2011 12:00:00 AM","Value":35},{"Key":"12/3/2011 12:00:00 AM","Value":20},{"Key":"12/4/2011 12:00:00 AM","Value":41},{"Key":"12/5/2011 12:00:00 AM","Value":79},{"Key":"12/6/2011 12:00:00 AM","Value":60},{"Key":"12/7/2011 12:00:00 AM","Value":62},{"Key":"12/8/2011 12:00:00 AM","Value":58},{"Key":"12/9/2011 12:00:00 AM","Value":49},{"Key":"12/10/2011 12:00:00 AM","Value":46},{"Key":"12/11/2011 12:00:00 AM","Value":53},{"Key":"12/12/2011 12:00:00 AM","Value":81},{"Key":"12/13/2011 12:00:00 AM","Value":66},{"Key":"12/14/2011 12:00:00 AM","Value":69},{"Key":"12/15/2011 12:00:00 AM","Value":74},{"Key":"12/16/2011 12:00:00 AM","Value":54},{"Key":"12/17/2011 12:00:00 AM","Value":37},{"Key":"12/18/2011 12:00:00 AM","Value":48},{"Key":"12/19/2011 12:00:00 AM","Value":74},{"Key":"12/20/2011 12:00:00 AM","Value":26},{"Key":"12/27/2011 12:00:00 AM","Value":2},{"Key":"12/28/2011 12:00:00 AM","Value":1},{"Key":"12/29/2011 12:00:00 AM","Value":1},{"Key":"1/3/2012 12:00:00 AM","Value":2},{"Key":"1/4/2012 12:00:00 AM","Value":8},{"Key":"1/5/2012 12:00:00 AM","Value":6},{"Key":"1/6/2012 12:00:00 AM","Value":5},{"Key":"1/9/2012 12:00:00 AM","Value":3},{"Key":"1/10/2012 12:00:00 AM","Value":6},{"Key":"1/11/2012 12:00:00 AM","Value":5},{"Key":"1/12/2012 12:00:00 AM","Value":6},{"Key":"1/13/2012 12:00:00 AM","Value":10},{"Key":"1/16/2012 12:00:00 AM","Value":1},{"Key":"1/17/2012 12:00:00 AM","Value":3},{"Key":"1/18/2012 12:00:00 AM","Value":5},{"Key":"1/19/2012 12:00:00 AM","Value":4},{"Key":"1/20/2012 12:00:00 AM","Value":3},{"Key":"1/22/2012 12:00:00 AM","Value":1},{"Key":"1/23/2012 12:00:00 AM","Value":29},{"Key":"1/24/2012 12:00:00 AM","Value":14},{"Key":"1/25/2012 12:00:00 AM","Value":40},{"Key":"1/26/2012 12:00:00 AM","Value":35},{"Key":"1/27/2012 12:00:00 AM","Value":21},{"Key":"1/28/2012 12:00:00 AM","Value":9},{"Key":"1/29/2012 12:00:00 AM","Value":25},{"Key":"1/30/2012 12:00:00 AM","Value":45},{"Key":"1/31/2012 12:00:00 AM","Value":33},{"Key":"2/1/2012 12:00:00 AM","Value":47},{"Key":"2/2/2012 12:00:00 AM","Value":49},{"Key":"2/3/2012 12:00:00 AM","Value":24},{"Key":"2/4/2012 12:00:00 AM","Value":15},{"Key":"2/5/2012 12:00:00 AM","Value":22},{"Key":"2/6/2012 12:00:00 AM","Value":53},{"Key":"2/7/2012 12:00:00 AM","Value":51},{"Key":"2/8/2012 12:00:00 AM","Value":50},{"Key":"2/9/2012 12:00:00 AM","Value":42},{"Key":"2/10/2012 12:00:00 AM","Value":29},{"Key":"2/11/2012 12:00:00 AM","Value":17},{"Key":"2/12/2012 12:00:00 AM","Value":31},{"Key":"2/13/2012 12:00:00 AM","Value":56},{"Key":"2/14/2012 12:00:00 AM","Value":47},{"Key":"2/15/2012 12:00:00 AM","Value":65},{"Key":"2/16/2012 12:00:00 AM","Value":53},{"Key":"2/17/2012 12:00:00 AM","Value":37},{"Key":"2/18/2012 12:00:00 AM","Value":21},{"Key":"2/19/2012 12:00:00 AM","Value":33},{"Key":"2/20/2012 12:00:00 AM","Value":59},{"Key":"2/21/2012 12:00:00 AM","Value":55},{"Key":"2/22/2012 12:00:00 AM","Value":74},{"Key":"2/23/2012 12:00:00 AM","Value":60},{"Key":"2/24/2012 12:00:00 AM","Value":42},{"Key":"2/25/2012 12:00:00 AM","Value":15},{"Key":"2/26/2012 12:00:00 AM","Value":27},{"Key":"2/27/2012 12:00:00 AM","Value":68},{"Key":"2/28/2012 12:00:00 AM","Value":65},{"Key":"2/29/2012 12:00:00 AM","Value":65},{"Key":"3/1/2012 12:00:00 AM","Value":48},{"Key":"3/2/2012 12:00:00 AM","Value":33},{"Key":"3/3/2012 12:00:00 AM","Value":11},{"Key":"3/4/2012 12:00:00 AM","Value":31},{"Key":"3/5/2012 12:00:00 AM","Value":67},{"Key":"3/6/2012 12:00:00 AM","Value":49},{"Key":"3/7/2012 12:00:00 AM","Value":59},{"Key":"3/8/2012 12:00:00 AM","Value":55},{"Key":"3/9/2012 12:00:00 AM","Value":32},{"Key":"3/10/2012 12:00:00 AM","Value":14},{"Key":"3/11/2012 12:00:00 AM","Value":45},{"Key":"3/12/2012 12:00:00 AM","Value":56},{"Key":"3/13/2012 12:00:00 AM","Value":58},{"Key":"3/14/2012 12:00:00 AM","Value":55},{"Key":"3/15/2012 12:00:00 AM","Value":53},{"Key":"3/16/2012 12:00:00 AM","Value":36},{"Key":"3/17/2012 12:00:00 AM","Value":12},{"Key":"3/18/2012 12:00:00 AM","Value":37},{"Key":"3/19/2012 12:00:00 AM","Value":63},{"Key":"3/20/2012 12:00:00 AM","Value":63},{"Key":"3/21/2012 12:00:00 AM","Value":74},{"Key":"3/22/2012 12:00:00 AM","Value":55},{"Key":"3/23/2012 12:00:00 AM","Value":37},{"Key":"3/24/2012 12:00:00 AM","Value":13},{"Key":"3/25/2012 12:00:00 AM","Value":32},{"Key":"3/26/2012 12:00:00 AM","Value":59},{"Key":"3/27/2012 12:00:00 AM","Value":54},{"Key":"3/28/2012 12:00:00 AM","Value":62},{"Key":"3/29/2012 12:00:00 AM","Value":34},{"Key":"3/30/2012 12:00:00 AM","Value":14},{"Key":"4/2/2012 12:00:00 AM","Value":1},{"Key":"4/7/2012 12:00:00 AM","Value":1},{"Key":"4/8/2012 12:00:00 AM","Value":8},{"Key":"4/9/2012 12:00:00 AM","Value":61},{"Key":"4/10/2012 12:00:00 AM","Value":55},{"Key":"4/11/2012 12:00:00 AM","Value":67},{"Key":"4/12/2012 12:00:00 AM","Value":51},{"Key":"4/13/2012 12:00:00 AM","Value":28},{"Key":"4/14/2012 12:00:00 AM","Value":17},{"Key":"4/15/2012 12:00:00 AM","Value":38},{"Key":"4/16/2012 12:00:00 AM","Value":53},{"Key":"4/17/2012 12:00:00 AM","Value":55},{"Key":"4/18/2012 12:00:00 AM","Value":63},{"Key":"4/19/2012 12:00:00 AM","Value":42},{"Key":"4/20/2012 12:00:00 AM","Value":21},{"Key":"4/21/2012 12:00:00 AM","Value":13},{"Key":"4/22/2012 12:00:00 AM","Value":32},{"Key":"4/23/2012 12:00:00 AM","Value":71},{"Key":"4/24/2012 12:00:00 AM","Value":54},{"Key":"4/25/2012 12:00:00 AM","Value":67},{"Key":"4/26/2012 12:00:00 AM","Value":50},{"Key":"4/27/2012 12:00:00 AM","Value":31},{"Key":"4/28/2012 12:00:00 AM","Value":16},{"Key":"4/29/2012 12:00:00 AM","Value":35},{"Key":"4/30/2012 12:00:00 AM","Value":55},{"Key":"5/1/2012 12:00:00 AM","Value":61},{"Key":"5/2/2012 12:00:00 AM","Value":69},{"Key":"5/3/2012 12:00:00 AM","Value":52},{"Key":"5/4/2012 12:00:00 AM","Value":46},{"Key":"5/5/2012 12:00:00 AM","Value":17},{"Key":"5/6/2012 12:00:00 AM","Value":38},{"Key":"5/7/2012 12:00:00 AM","Value":68},{"Key":"5/8/2012 12:00:00 AM","Value":74},{"Key":"5/9/2012 12:00:00 AM","Value":80},{"Key":"5/10/2012 12:00:00 AM","Value":72},{"Key":"5/11/2012 12:00:00 AM","Value":39},{"Key":"5/12/2012 12:00:00 AM","Value":20},{"Key":"5/13/2012 12:00:00 AM","Value":39},{"Key":"5/14/2012 12:00:00 AM","Value":51},{"Key":"5/15/2012 12:00:00 AM","Value":11},{"Key":"5/16/2012 12:00:00 AM","Value":1},{"Key":"5/17/2012 12:00:00 AM","Value":1},{"Key":"5/25/2012 12:00:00 AM","Value":1},{"Key":"5/29/2012 12:00:00 AM","Value":4},{"Key":"5/30/2012 12:00:00 AM","Value":3},{"Key":"5/31/2012 12:00:00 AM","Value":1},{"Key":"6/5/2012 12:00:00 AM","Value":9},{"Key":"6/6/2012 12:00:00 AM","Value":13},{"Key":"6/7/2012 12:00:00 AM","Value":9},{"Key":"6/8/2012 12:00:00 AM","Value":2},{"Key":"6/11/2012 12:00:00 AM","Value":6},{"Key":"6/12/2012 12:00:00 AM","Value":11},{"Key":"6/13/2012 12:00:00 AM","Value":12},{"Key":"6/14/2012 12:00:00 AM","Value":12},{"Key":"6/15/2012 12:00:00 AM","Value":3},{"Key":"6/18/2012 12:00:00 AM","Value":9},{"Key":"6/19/2012 12:00:00 AM","Value":18},{"Key":"6/20/2012 12:00:00 AM","Value":11},{"Key":"6/21/2012 12:00:00 AM","Value":10},{"Key":"6/22/2012 12:00:00 AM","Value":1},{"Key":"6/25/2012 12:00:00 AM","Value":9},{"Key":"6/26/2012 12:00:00 AM","Value":11},{"Key":"6/27/2012 12:00:00 AM","Value":14},{"Key":"6/28/2012 12:00:00 AM","Value":9},{"Key":"6/29/2012 12:00:00 AM","Value":5},{"Key":"7/2/2012 12:00:00 AM","Value":9},{"Key":"7/3/2012 12:00:00 AM","Value":13},{"Key":"7/5/2012 12:00:00 AM","Value":14},{"Key":"7/6/2012 12:00:00 AM","Value":2},{"Key":"7/9/2012 12:00:00 AM","Value":2},{"Key":"7/10/2012 12:00:00 AM","Value":4},{"Key":"7/11/2012 12:00:00 AM","Value":7},{"Key":"7/12/2012 12:00:00 AM","Value":3},{"Key":"7/13/2012 12:00:00 AM","Value":1},{"Key":"7/16/2012 12:00:00 AM","Value":8},{"Key":"7/17/2012 12:00:00 AM","Value":10},{"Key":"7/18/2012 12:00:00 AM","Value":7},{"Key":"7/19/2012 12:00:00 AM","Value":8},{"Key":"7/20/2012 12:00:00 AM","Value":1},{"Key":"7/23/2012 12:00:00 AM","Value":2},{"Key":"7/24/2012 12:00:00 AM","Value":10},{"Key":"7/25/2012 12:00:00 AM","Value":6},{"Key":"7/26/2012 12:00:00 AM","Value":4},{"Key":"7/30/2012 12:00:00 AM","Value":4}] }
   
    alldata = [{"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":124},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67}]},
{"Title":"Reservations By Date","Items":[{"Key":"11/23/2011 12:00:00 AM","Value":1},{"Key":"11/27/2011 12:00:00 AM","Value":21},{"Key":"11/28/2011 12:00:00 AM","Value":67},{"Key":"11/29/2011 12:00:00 AM","Value":63},{"Key":"11/30/2011 12:00:00 AM","Value":73},{"Key":"12/1/2011 12:00:00 AM","Value":55},{"Key":"12/2/2011 12:00:00 AM","Value":35},{"Key":"12/3/2011 12:00:00 AM","Value":20},{"Key":"12/4/2011 12:00:00 AM","Value":41},{"Key":"12/5/2011 12:00:00 AM","Value":79},{"Key":"12/6/2011 12:00:00 AM","Value":60},{"Key":"12/7/2011 12:00:00 AM","Value":62},{"Key":"12/8/2011 12:00:00 AM","Value":58},{"Key":"12/9/2011 12:00:00 AM","Value":49},{"Key":"12/10/2011 12:00:00 AM","Value":46},{"Key":"12/11/2011 12:00:00 AM","Value":53},{"Key":"12/12/2011 12:00:00 AM","Value":81},{"Key":"12/13/2011 12:00:00 AM","Value":66},{"Key":"12/14/2011 12:00:00 AM","Value":69},{"Key":"12/15/2011 12:00:00 AM","Value":74},{"Key":"12/16/2011 12:00:00 AM","Value":54},{"Key":"12/17/2011 12:00:00 AM","Value":37},{"Key":"12/18/2011 12:00:00 AM","Value":48},{"Key":"12/19/2011 12:00:00 AM","Value":74},{"Key":"12/20/2011 12:00:00 AM","Value":26},{"Key":"12/27/2011 12:00:00 AM","Value":2},{"Key":"12/28/2011 12:00:00 AM","Value":1},{"Key":"12/29/2011 12:00:00 AM","Value":1},{"Key":"1/3/2012 12:00:00 AM","Value":2},{"Key":"1/4/2012 12:00:00 AM","Value":8},{"Key":"1/5/2012 12:00:00 AM","Value":6},{"Key":"1/6/2012 12:00:00 AM","Value":5},{"Key":"1/9/2012 12:00:00 AM","Value":3},{"Key":"1/10/2012 12:00:00 AM","Value":6},{"Key":"1/11/2012 12:00:00 AM","Value":5},{"Key":"1/12/2012 12:00:00 AM","Value":6},{"Key":"1/13/2012 12:00:00 AM","Value":10},{"Key":"1/16/2012 12:00:00 AM","Value":1},{"Key":"1/17/2012 12:00:00 AM","Value":3},{"Key":"1/18/2012 12:00:00 AM","Value":5},{"Key":"1/19/2012 12:00:00 AM","Value":4},{"Key":"1/20/2012 12:00:00 AM","Value":3},{"Key":"1/22/2012 12:00:00 AM","Value":1},{"Key":"1/23/2012 12:00:00 AM","Value":29},{"Key":"1/24/2012 12:00:00 AM","Value":14},{"Key":"1/25/2012 12:00:00 AM","Value":40},{"Key":"1/26/2012 12:00:00 AM","Value":35},{"Key":"1/27/2012 12:00:00 AM","Value":21},{"Key":"1/28/2012 12:00:00 AM","Value":9},{"Key":"1/29/2012 12:00:00 AM","Value":25},{"Key":"1/30/2012 12:00:00 AM","Value":45},{"Key":"1/31/2012 12:00:00 AM","Value":33},{"Key":"2/1/2012 12:00:00 AM","Value":47},{"Key":"2/2/2012 12:00:00 AM","Value":49},{"Key":"2/3/2012 12:00:00 AM","Value":24},{"Key":"2/4/2012 12:00:00 AM","Value":15},{"Key":"2/5/2012 12:00:00 AM","Value":22},{"Key":"2/6/2012 12:00:00 AM","Value":53},{"Key":"2/7/2012 12:00:00 AM","Value":51},{"Key":"2/8/2012 12:00:00 AM","Value":50},{"Key":"2/9/2012 12:00:00 AM","Value":42},{"Key":"2/10/2012 12:00:00 AM","Value":29},{"Key":"2/11/2012 12:00:00 AM","Value":17},{"Key":"2/12/2012 12:00:00 AM","Value":31},{"Key":"2/13/2012 12:00:00 AM","Value":56},{"Key":"2/14/2012 12:00:00 AM","Value":47},{"Key":"2/15/2012 12:00:00 AM","Value":65},{"Key":"2/16/2012 12:00:00 AM","Value":53},{"Key":"2/17/2012 12:00:00 AM","Value":37},{"Key":"2/18/2012 12:00:00 AM","Value":21},{"Key":"2/19/2012 12:00:00 AM","Value":33},{"Key":"2/20/2012 12:00:00 AM","Value":59},{"Key":"2/21/2012 12:00:00 AM","Value":55},{"Key":"2/22/2012 12:00:00 AM","Value":74},{"Key":"2/23/2012 12:00:00 AM","Value":60},{"Key":"2/24/2012 12:00:00 AM","Value":42},{"Key":"2/25/2012 12:00:00 AM","Value":15},{"Key":"2/26/2012 12:00:00 AM","Value":27},{"Key":"2/27/2012 12:00:00 AM","Value":68},{"Key":"2/28/2012 12:00:00 AM","Value":65},{"Key":"2/29/2012 12:00:00 AM","Value":65},{"Key":"3/1/2012 12:00:00 AM","Value":48},{"Key":"3/2/2012 12:00:00 AM","Value":33},{"Key":"3/3/2012 12:00:00 AM","Value":11},{"Key":"3/4/2012 12:00:00 AM","Value":31},{"Key":"3/5/2012 12:00:00 AM","Value":67},{"Key":"3/6/2012 12:00:00 AM","Value":49},{"Key":"3/7/2012 12:00:00 AM","Value":59},{"Key":"3/8/2012 12:00:00 AM","Value":55},{"Key":"3/9/2012 12:00:00 AM","Value":32},{"Key":"3/10/2012 12:00:00 AM","Value":14},{"Key":"3/11/2012 12:00:00 AM","Value":45},{"Key":"3/12/2012 12:00:00 AM","Value":56},{"Key":"3/13/2012 12:00:00 AM","Value":58},{"Key":"3/14/2012 12:00:00 AM","Value":55},{"Key":"3/15/2012 12:00:00 AM","Value":53},{"Key":"3/16/2012 12:00:00 AM","Value":36},{"Key":"3/17/2012 12:00:00 AM","Value":12},{"Key":"3/18/2012 12:00:00 AM","Value":37},{"Key":"3/19/2012 12:00:00 AM","Value":63},{"Key":"3/20/2012 12:00:00 AM","Value":63},{"Key":"3/21/2012 12:00:00 AM","Value":74},{"Key":"3/22/2012 12:00:00 AM","Value":55},{"Key":"3/23/2012 12:00:00 AM","Value":37},{"Key":"3/24/2012 12:00:00 AM","Value":13},{"Key":"3/25/2012 12:00:00 AM","Value":32},{"Key":"3/26/2012 12:00:00 AM","Value":59},{"Key":"3/27/2012 12:00:00 AM","Value":54},{"Key":"3/28/2012 12:00:00 AM","Value":62},{"Key":"3/29/2012 12:00:00 AM","Value":34},{"Key":"3/30/2012 12:00:00 AM","Value":14},{"Key":"4/2/2012 12:00:00 AM","Value":1},{"Key":"4/7/2012 12:00:00 AM","Value":1},{"Key":"4/8/2012 12:00:00 AM","Value":8},{"Key":"4/9/2012 12:00:00 AM","Value":61},{"Key":"4/10/2012 12:00:00 AM","Value":55},{"Key":"4/11/2012 12:00:00 AM","Value":67},{"Key":"4/12/2012 12:00:00 AM","Value":51},{"Key":"4/13/2012 12:00:00 AM","Value":28},{"Key":"4/14/2012 12:00:00 AM","Value":17},{"Key":"4/15/2012 12:00:00 AM","Value":38},{"Key":"4/16/2012 12:00:00 AM","Value":53},{"Key":"4/17/2012 12:00:00 AM","Value":55},{"Key":"4/18/2012 12:00:00 AM","Value":63},{"Key":"4/19/2012 12:00:00 AM","Value":42},{"Key":"4/20/2012 12:00:00 AM","Value":21},{"Key":"4/21/2012 12:00:00 AM","Value":13},{"Key":"4/22/2012 12:00:00 AM","Value":32},{"Key":"4/23/2012 12:00:00 AM","Value":71},{"Key":"4/24/2012 12:00:00 AM","Value":54},{"Key":"4/25/2012 12:00:00 AM","Value":67},{"Key":"4/26/2012 12:00:00 AM","Value":50},{"Key":"4/27/2012 12:00:00 AM","Value":31},{"Key":"4/28/2012 12:00:00 AM","Value":16},{"Key":"4/29/2012 12:00:00 AM","Value":35},{"Key":"4/30/2012 12:00:00 AM","Value":55},{"Key":"5/1/2012 12:00:00 AM","Value":61},{"Key":"5/2/2012 12:00:00 AM","Value":69},{"Key":"5/3/2012 12:00:00 AM","Value":52},{"Key":"5/4/2012 12:00:00 AM","Value":46},{"Key":"5/5/2012 12:00:00 AM","Value":17},{"Key":"5/6/2012 12:00:00 AM","Value":38},{"Key":"5/7/2012 12:00:00 AM","Value":68},{"Key":"5/8/2012 12:00:00 AM","Value":74},{"Key":"5/9/2012 12:00:00 AM","Value":80},{"Key":"5/10/2012 12:00:00 AM","Value":72},{"Key":"5/11/2012 12:00:00 AM","Value":39},{"Key":"5/12/2012 12:00:00 AM","Value":20},{"Key":"5/13/2012 12:00:00 AM","Value":39},{"Key":"5/14/2012 12:00:00 AM","Value":51},{"Key":"5/15/2012 12:00:00 AM","Value":11},{"Key":"5/16/2012 12:00:00 AM","Value":1},{"Key":"5/17/2012 12:00:00 AM","Value":1},{"Key":"5/25/2012 12:00:00 AM","Value":1},{"Key":"5/29/2012 12:00:00 AM","Value":4},{"Key":"5/30/2012 12:00:00 AM","Value":3},{"Key":"5/31/2012 12:00:00 AM","Value":1},{"Key":"6/5/2012 12:00:00 AM","Value":9},{"Key":"6/6/2012 12:00:00 AM","Value":13},{"Key":"6/7/2012 12:00:00 AM","Value":9},{"Key":"6/8/2012 12:00:00 AM","Value":2},{"Key":"6/11/2012 12:00:00 AM","Value":6},{"Key":"6/12/2012 12:00:00 AM","Value":11},{"Key":"6/13/2012 12:00:00 AM","Value":12},{"Key":"6/14/2012 12:00:00 AM","Value":12},{"Key":"6/15/2012 12:00:00 AM","Value":3},{"Key":"6/18/2012 12:00:00 AM","Value":9},{"Key":"6/19/2012 12:00:00 AM","Value":18},{"Key":"6/20/2012 12:00:00 AM","Value":11},{"Key":"6/21/2012 12:00:00 AM","Value":10},{"Key":"6/22/2012 12:00:00 AM","Value":1},{"Key":"6/25/2012 12:00:00 AM","Value":9},{"Key":"6/26/2012 12:00:00 AM","Value":11},{"Key":"6/27/2012 12:00:00 AM","Value":14},{"Key":"6/28/2012 12:00:00 AM","Value":9},{"Key":"6/29/2012 12:00:00 AM","Value":5},{"Key":"7/2/2012 12:00:00 AM","Value":9},{"Key":"7/3/2012 12:00:00 AM","Value":13},{"Key":"7/5/2012 12:00:00 AM","Value":14},{"Key":"7/6/2012 12:00:00 AM","Value":2},{"Key":"7/9/2012 12:00:00 AM","Value":2},{"Key":"7/10/2012 12:00:00 AM","Value":4},{"Key":"7/11/2012 12:00:00 AM","Value":7},{"Key":"7/12/2012 12:00:00 AM","Value":3},{"Key":"7/13/2012 12:00:00 AM","Value":1},{"Key":"7/16/2012 12:00:00 AM","Value":8},{"Key":"7/17/2012 12:00:00 AM","Value":10},{"Key":"7/18/2012 12:00:00 AM","Value":7},{"Key":"7/19/2012 12:00:00 AM","Value":8},{"Key":"7/20/2012 12:00:00 AM","Value":1},{"Key":"7/23/2012 12:00:00 AM","Value":2},{"Key":"7/24/2012 12:00:00 AM","Value":10},{"Key":"7/25/2012 12:00:00 AM","Value":6},{"Key":"7/26/2012 12:00:00 AM","Value":4},{"Key":"7/30/2012 12:00:00 AM","Value":4}] },
{"Title":"FAF","Items":[{"Key":"8/29/2010 12:00:00 AM","Value":3},{"Key":"8/30/2010 12:00:00 AM","Value":42},{"Key":"8/31/2010 12:00:00 AM","Value":40},{"Key":"9/1/2010 12:00:00 AM","Value":49},{"Key":"9/2/2010 12:00:00 AM","Value":34},{"Key":"9/3/2010 12:00:00 AM","Value":32},{"Key":"9/4/2010 12:00:00 AM","Value":8},{"Key":"9/5/2010 12:00:00 AM","Value":13},{"Key":"9/6/2010 12:00:00 AM","Value":1},{"Key":"9/7/2010 12:00:00 AM","Value":52},{"Key":"9/8/2010 12:00:00 AM","Value":40},{"Key":"9/9/2010 12:00:00 AM","Value":16},{"Key":"9/10/2010 12:00:00 AM","Value":15},{"Key":"9/11/2010 12:00:00 AM","Value":5},{"Key":"9/12/2010 12:00:00 AM","Value":20},{"Key":"9/13/2010 12:00:00 AM","Value":63},{"Key":"9/14/2010 12:00:00 AM","Value":44},{"Key":"9/15/2010 12:00:00 AM","Value":54},{"Key":"9/16/2010 12:00:00 AM","Value":54},{"Key":"9/17/2010 12:00:00 AM","Value":32},{"Key":"9/18/2010 12:00:00 AM","Value":18},{"Key":"9/19/2010 12:00:00 AM","Value":30},{"Key":"9/20/2010 12:00:00 AM","Value":63},{"Key":"9/21/2010 12:00:00 AM","Value":60},{"Key":"9/22/2010 12:00:00 AM","Value":68},{"Key":"9/23/2010 12:00:00 AM","Value":57},{"Key":"9/24/2010 12:00:00 AM","Value":39},{"Key":"9/25/2010 12:00:00 AM","Value":17},{"Key":"9/26/2010 12:00:00 AM","Value":38},{"Key":"9/27/2010 12:00:00 AM","Value":69},{"Key":"9/28/2010 12:00:00 AM","Value":75},{"Key":"9/29/2010 12:00:00 AM","Value":80},{"Key":"9/30/2010 12:00:00 AM","Value":64},{"Key":"10/1/2010 12:00:00 AM","Value":39},{"Key":"10/2/2010 12:00:00 AM","Value":19},{"Key":"10/3/2010 12:00:00 AM","Value":42},{"Key":"10/4/2010 12:00:00 AM","Value":73},{"Key":"10/5/2010 12:00:00 AM","Value":65},{"Key":"10/6/2010 12:00:00 AM","Value":73},{"Key":"10/7/2010 12:00:00 AM","Value":46},{"Key":"10/8/2010 12:00:00 AM","Value":29},{"Key":"10/9/2010 12:00:00 AM","Value":8},{"Key":"10/10/2010 12:00:00 AM","Value":24},{"Key":"10/11/2010 12:00:00 AM","Value":67},{"Key":"10/12/2010 12:00:00 AM","Value":63},{"Key":"10/13/2010 12:00:00 AM","Value":78},{"Key":"10/14/2010 12:00:00 AM","Value":69},{"Key":"10/15/2010 12:00:00 AM","Value":37},{"Key":"10/16/2010 12:00:00 AM","Value":24},{"Key":"10/17/2010 12:00:00 AM","Value":43},{"Key":"10/18/2010 12:00:00 AM","Value":74},{"Key":"10/19/2010 12:00:00 AM","Value":75},{"Key":"10/20/2010 12:00:00 AM","Value":76},{"Key":"10/21/2010 12:00:00 AM","Value":73},{"Key":"10/22/2010 12:00:00 AM","Value":33},{"Key":"10/23/2010 12:00:00 AM","Value":20},{"Key":"10/24/2010 12:00:00 AM","Value":39},{"Key":"10/25/2010 12:00:00 AM","Value":60},{"Key":"10/26/2010 12:00:00 AM","Value":65},{"Key":"10/27/2010 12:00:00 AM","Value":76},{"Key":"10/28/2010 12:00:00 AM","Value":64},{"Key":"10/29/2010 12:00:00 AM","Value":34},{"Key":"10/30/2010 12:00:00 AM","Value":18},{"Key":"10/31/2010 12:00:00 AM","Value":34},{"Key":"11/1/2010 12:00:00 AM","Value":66},{"Key":"11/2/2010 12:00:00 AM","Value":65},{"Key":"11/3/2010 12:00:00 AM","Value":73},{"Key":"11/4/2010 12:00:00 AM","Value":57},{"Key":"11/5/2010 12:00:00 AM","Value":39},{"Key":"11/6/2010 12:00:00 AM","Value":23},{"Key":"11/7/2010 12:00:00 AM","Value":31},{"Key":"11/8/2010 12:00:00 AM","Value":65},{"Key":"11/9/2010 12:00:00 AM","Value":63},{"Key":"11/10/2010 12:00:00 AM","Value":85},{"Key":"11/11/2010 12:00:00 AM","Value":70},{"Key":"11/12/2010 12:00:00 AM","Value":41},{"Key":"11/13/2010 12:00:00 AM","Value":20},{"Key":"11/14/2010 12:00:00 AM","Value":32},{"Key":"11/15/2010 12:00:00 AM","Value":59},{"Key":"11/16/2010 12:00:00 AM","Value":65},{"Key":"11/17/2010 12:00:00 AM","Value":65},{"Key":"11/18/2010 12:00:00 AM","Value":56},{"Key":"11/19/2010 12:00:00 AM","Value":35},{"Key":"11/20/2010 12:00:00 AM","Value":19},{"Key":"11/21/2010 12:00:00 AM","Value":35},{"Key":"11/22/2010 12:00:00 AM","Value":58},{"Key":"11/23/2010 12:00:00 AM","Value":50},{"Key":"11/24/2010 12:00:00 AM","Value":14},{"Key":"11/28/2010 12:00:00 AM","Value":25},{"Key":"11/29/2010 12:00:00 AM","Value":62},{"Key":"11/30/2010 12:00:00 AM","Value":69},{"Key":"12/1/2010 12:00:00 AM","Value":73},{"Key":"12/2/2010 12:00:00 AM","Value":67},{"Key":"12/3/2010 12:00:00 AM","Value":39},{"Key":"12/4/2010 12:00:00 AM","Value":24},{"Key":"12/5/2010 12:00:00 AM","Value":39},{"Key":"12/6/2010 12:00:00 AM","Value":66},{"Key":"12/7/2010 12:00:00 AM","Value":69},{"Key":"12/8/2010 12:00:00 AM","Value":69},{"Key":"12/9/2010 12:00:00 AM","Value":60},{"Key":"12/10/2010 12:00:00 AM","Value":57},{"Key":"12/11/2010 12:00:00 AM","Value":47},{"Key":"12/12/2010 12:00:00 AM","Value":51},{"Key":"12/13/2010 12:00:00 AM","Value":66},{"Key":"12/14/2010 12:00:00 AM","Value":58},{"Key":"12/15/2010 12:00:00 AM","Value":52},{"Key":"12/16/2010 12:00:00 AM","Value":54},{"Key":"12/17/2010 12:00:00 AM","Value":20},{"Key":"12/18/2010 12:00:00 AM","Value":5},{"Key":"12/19/2010 12:00:00 AM","Value":19},{"Key":"12/20/2010 12:00:00 AM","Value":15},{"Key":"1/3/2011 12:00:00 AM","Value":5},{"Key":"1/4/2011 12:00:00 AM","Value":8},{"Key":"1/5/2011 12:00:00 AM","Value":9},{"Key":"1/6/2011 12:00:00 AM","Value":5},{"Key":"1/7/2011 12:00:00 AM","Value":4},{"Key":"1/10/2011 12:00:00 AM","Value":7},{"Key":"1/11/2011 12:00:00 AM","Value":4},{"Key":"1/13/2011 12:00:00 AM","Value":3},{"Key":"1/14/2011 12:00:00 AM","Value":3},{"Key":"1/18/2011 12:00:00 AM","Value":6},{"Key":"1/19/2011 12:00:00 AM","Value":6},{"Key":"1/20/2011 12:00:00 AM","Value":4},{"Key":"1/21/2011 12:00:00 AM","Value":5},{"Key":"1/24/2011 12:00:00 AM","Value":2},{"Key":"1/25/2011 12:00:00 AM","Value":8},{"Key":"1/26/2011 12:00:00 AM","Value":2},{"Key":"1/27/2011 12:00:00 AM","Value":1},{"Key":"1/28/2011 12:00:00 AM","Value":7},{"Key":"1/31/2011 12:00:00 AM","Value":18},{"Key":"2/1/2011 12:00:00 AM","Value":31},{"Key":"2/2/2011 12:00:00 AM","Value":35},{"Key":"2/3/2011 12:00:00 AM","Value":34},{"Key":"2/4/2011 12:00:00 AM","Value":14},{"Key":"2/5/2011 12:00:00 AM","Value":14},{"Key":"2/6/2011 12:00:00 AM","Value":16},{"Key":"2/7/2011 12:00:00 AM","Value":64},{"Key":"2/8/2011 12:00:00 AM","Value":50},{"Key":"2/9/2011 12:00:00 AM","Value":48},{"Key":"2/10/2011 12:00:00 AM","Value":43},{"Key":"2/11/2011 12:00:00 AM","Value":30},{"Key":"2/12/2011 12:00:00 AM","Value":8},{"Key":"2/13/2011 12:00:00 AM","Value":25},{"Key":"2/14/2011 12:00:00 AM","Value":57},{"Key":"2/15/2011 12:00:00 AM","Value":56},{"Key":"2/16/2011 12:00:00 AM","Value":60},{"Key":"2/17/2011 12:00:00 AM","Value":60},{"Key":"2/18/2011 12:00:00 AM","Value":35},{"Key":"2/19/2011 12:00:00 AM","Value":19},{"Key":"2/20/2011 12:00:00 AM","Value":37},{"Key":"2/21/2011 12:00:00 AM","Value":58},{"Key":"2/22/2011 12:00:00 AM","Value":67},{"Key":"2/23/2011 12:00:00 AM","Value":64},{"Key":"2/24/2011 12:00:00 AM","Value":62},{"Key":"2/25/2011 12:00:00 AM","Value":34},{"Key":"2/26/2011 12:00:00 AM","Value":16},{"Key":"2/27/2011 12:00:00 AM","Value":32},{"Key":"2/28/2011 12:00:00 AM","Value":58},{"Key":"3/1/2011 12:00:00 AM","Value":74},{"Key":"3/2/2011 12:00:00 AM","Value":69},{"Key":"3/3/2011 12:00:00 AM","Value":75},{"Key":"3/4/2011 12:00:00 AM","Value":37},{"Key":"3/5/2011 12:00:00 AM","Value":14},{"Key":"3/6/2011 12:00:00 AM","Value":35},{"Key":"3/7/2011 12:00:00 AM","Value":56},{"Key":"3/8/2011 12:00:00 AM","Value":60},{"Key":"3/9/2011 12:00:00 AM","Value":66},{"Key":"3/10/2011 12:00:00 AM","Value":56},{"Key":"3/11/2011 12:00:00 AM","Value":38},{"Key":"3/12/2011 12:00:00 AM","Value":9},{"Key":"3/13/2011 12:00:00 AM","Value":28},{"Key":"3/14/2011 12:00:00 AM","Value":71},{"Key":"3/15/2011 12:00:00 AM","Value":63},{"Key":"3/16/2011 12:00:00 AM","Value":70},{"Key":"3/17/2011 12:00:00 AM","Value":63},{"Key":"3/18/2011 12:00:00 AM","Value":29},{"Key":"3/19/2011 12:00:00 AM","Value":16},{"Key":"3/20/2011 12:00:00 AM","Value":29},{"Key":"3/21/2011 12:00:00 AM","Value":70},{"Key":"3/22/2011 12:00:00 AM","Value":65},{"Key":"3/23/2011 12:00:00 AM","Value":57},{"Key":"3/24/2011 12:00:00 AM","Value":57},{"Key":"3/25/2011 12:00:00 AM","Value":33},{"Key":"3/26/2011 12:00:00 AM","Value":15},{"Key":"3/27/2011 12:00:00 AM","Value":33},{"Key":"3/28/2011 12:00:00 AM","Value":64},{"Key":"3/29/2011 12:00:00 AM","Value":59},{"Key":"3/30/2011 12:00:00 AM","Value":60},{"Key":"3/31/2011 12:00:00 AM","Value":61},{"Key":"4/1/2011 12:00:00 AM","Value":26},{"Key":"4/2/2011 12:00:00 AM","Value":11},{"Key":"4/3/2011 12:00:00 AM","Value":29},{"Key":"4/4/2011 12:00:00 AM","Value":63},{"Key":"4/5/2011 12:00:00 AM","Value":60},{"Key":"4/6/2011 12:00:00 AM","Value":58},{"Key":"4/7/2011 12:00:00 AM","Value":51},{"Key":"4/8/2011 12:00:00 AM","Value":37},{"Key":"4/9/2011 12:00:00 AM","Value":21}] }
    ]
    //  array with all elements
    //var alldata = [array, array2]
   
    console.log(alldata)
    var fillcolors = ["blue", "orange", "violet"]
    var dotcolors = ["red", "green", "yellow"]
    // get max value
    var max = 0
    var min = 0 // ASSUMING THE DATA STARTS AS BASE AS ZERO.... CHANGE AS NEEDED DEPENDING ON YOUR DATA
    for (var i =0; i < alldata.length; i++){
        var data = alldata[i]["Items"]
        //var data_values = []
        //var data_keys = []
        for (var i = 0; i < data.length; i++){
            if ( data[i]["Value"] > max ) {
                max = data[i]["Value"]
            }
            else if ( data[i]["Value"] < min ) {
                min = data[i]["Value"]
            }
            //data_values.push(data[i]["Value"]);
           // data_keys.push(data[i]["Key"]);
           // alldata[0] = 
        }
    }
    

    /* SET UP MARGINS AND AXISES  */
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1000,
        height = 500;

    var x = d3.time.scale()
        .domain([0,data.length])
        .range([0, 1000]); // data.length

    var y = d3.scale.linear()
        .domain([min, max+5]) // $0 to $80
        .range([height, 0]); // svg = y-down // data[0]["Value"]

    //x.domain (d3.extent(data, function(d) { return d["Key"]; }));
    //y.domain (d3.extent(data, function(d) { return d["Value"]; }));


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

   var svg = d3.select("#" + id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(0,"+ -5 +")")
      .attr("x", width)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Time and Date");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Reservations");


      /* PLOT DATA */
    for (var j = 0; j < alldata.length; j++){
        var data = alldata[j]["Items"]
        var topTitle = alldata[j]["Title"]

        var key = keys[0]; // the one line we want as the x axis <- 

        var i = 0;
        var line = d3.svg.line()
            .x(function(d) { i +=1;return x(i);} ) // x(d)
            .y(function(d){return y(d["Value"]);}) 

        svg.append("path")
        .datum(data)
        .attr("class", "line")
        .style("stroke",fillcolors[j])
        .attr("d", line);
        
        i = 0;
        d3.selectAll(data).each (function(d,i){
         svg.append("circle")
            .datum(this)
            //.attr("cx",35)
            //.attr("cy",5)
            .attr("r", 2)
            .attr("cx", function(d) { i +=1;return x(i);})
            .attr("cy", function(d){return y(d["Value"])})
            .style("fill", "red") //dotcolor
            .on("mouseover", function(d){
               var circle = d3.select(this)
              
                    var x = parseInt(circle[0][0].cx.baseVal.valueAsString) -1 + ""
                    var y = parseInt(circle[0][0].cy.baseVal.valueAsString)  - 10 + "" 
                    var group = d3.select(this.parentNode)
                    .append("g")
                                  
                    if (d3.select("#text" + i)[0][0] != null){
                        d3.select("#text" + i)
                        .attr("class", "visible")
                        .attr("x", x)
                        .attr("y", y)
                    }
                    else{
                    group
                    .append("text")
                    .attr("id", "text"+i)
                    .attr("class", "visible")
                    .attr("x", x)
                    .attr("y", y)
                    .text( d["Value"] )
                    .style("fill", "red")//dotcolor
                    .style("font-size","1.2em")
                    }   
                })
                .on("mouseout", function(d){
                    d3.select("#text"+i)
                    .attr("class", "invisible")
            })
        });


    
    }
}

var makeScatterPlot = function (array, keys, id){
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":4},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67},{"Key":"3/23/2010 12:00:00 AM","Value":57},{"Key":"3/24/2010 12:00:00 AM","Value":69},{"Key":"3/25/2010 12:00:00 AM","Value":51},{"Key":"3/26/2010 12:00:00 AM","Value":16},{"Key":"3/29/2010 12:00:00 AM","Value":1},{"Key":"3/31/2010 12:00:00 AM","Value":5},{"Key":"4/1/2010 12:00:00 AM","Value":5},{"Key":"4/2/2010 12:00:00 AM","Value":5},{"Key":"4/4/2010 12:00:00 AM","Value":11},{"Key":"4/5/2010 12:00:00 AM","Value":52},{"Key":"4/6/2010 12:00:00 AM","Value":54},{"Key":"4/7/2010 12:00:00 AM","Value":59},{"Key":"4/8/2010 12:00:00 AM","Value":55},{"Key":"4/9/2010 12:00:00 AM","Value":37},{"Key":"4/10/2010 12:00:00 AM","Value":10},{"Key":"4/11/2010 12:00:00 AM","Value":29},{"Key":"4/12/2010 12:00:00 AM","Value":60},{"Key":"4/13/2010 12:00:00 AM","Value":56},{"Key":"4/14/2010 12:00:00 AM","Value":60},{"Key":"4/15/2010 12:00:00 AM","Value":48},{"Key":"4/16/2010 12:00:00 AM","Value":33},{"Key":"4/17/2010 12:00:00 AM","Value":17},{"Key":"4/18/2010 12:00:00 AM","Value":35},{"Key":"4/19/2010 12:00:00 AM","Value":60},{"Key":"4/20/2010 12:00:00 AM","Value":50},{"Key":"4/21/2010 12:00:00 AM","Value":63},{"Key":"4/22/2010 12:00:00 AM","Value":58},{"Key":"4/23/2010 12:00:00 AM","Value":31},{"Key":"4/24/2010 12:00:00 AM","Value":9},{"Key":"4/25/2010 12:00:00 AM","Value":32},{"Key":"4/26/2010 12:00:00 AM","Value":66},{"Key":"4/27/2010 12:00:00 AM","Value":44},{"Key":"4/28/2010 12:00:00 AM","Value":58},{"Key":"4/29/2010 12:00:00 AM","Value":55},{"Key":"4/30/2010 12:00:00 AM","Value":30},{"Key":"5/1/2010 12:00:00 AM","Value":12},{"Key":"5/2/2010 12:00:00 AM","Value":33},{"Key":"5/3/2010 12:00:00 AM","Value":55},{"Key":"5/4/2010 12:00:00 AM","Value":61},{"Key":"5/5/2010 12:00:00 AM","Value":59},{"Key":"5/6/2010 12:00:00 AM","Value":54},{"Key":"5/7/2010 12:00:00 AM","Value":42},{"Key":"5/8/2010 12:00:00 AM","Value":34},{"Key":"5/9/2010 12:00:00 AM","Value":43},{"Key":"5/10/2010 12:00:00 AM","Value":58},{"Key":"5/11/2010 12:00:00 AM","Value":48},{"Key":"5/12/2010 12:00:00 AM","Value":48},{"Key":"5/13/2010 12:00:00 AM","Value":46},{"Key":"5/14/2010 12:00:00 AM","Value":34},{"Key":"5/15/2010 12:00:00 AM","Value":30},{"Key":"5/16/2010 12:00:00 AM","Value":44},{"Key":"5/17/2010 12:00:00 AM","Value":46},{"Key":"5/18/2010 12:00:00 AM","Value":15},{"Key":"5/19/2010 12:00:00 AM","Value":1},{"Key":"5/20/2010 12:00:00 AM","Value":1},{"Key":"5/24/2010 12:00:00 AM","Value":1},{"Key":"5/26/2010 12:00:00 AM","Value":1},{"Key":"5/28/2010 12:00:00 AM","Value":1},{"Key":"6/1/2010 12:00:00 AM","Value":7},{"Key":"6/2/2010 12:00:00 AM","Value":8},{"Key":"6/3/2010 12:00:00 AM","Value":7},{"Key":"6/4/2010 12:00:00 AM","Value":2},{"Key":"6/7/2010 12:00:00 AM","Value":13},{"Key":"6/8/2010 12:00:00 AM","Value":8},{"Key":"6/9/2010 12:00:00 AM","Value":12},{"Key":"6/10/2010 12:00:00 AM","Value":15},{"Key":"6/11/2010 12:00:00 AM","Value":6},{"Key":"6/14/2010 12:00:00 AM","Value":18},{"Key":"6/15/2010 12:00:00 AM","Value":14},{"Key":"6/16/2010 12:00:00 AM","Value":10},{"Key":"6/17/2010 12:00:00 AM","Value":13},{"Key":"6/18/2010 12:00:00 AM","Value":5},{"Key":"6/21/2010 12:00:00 AM","Value":14},{"Key":"6/22/2010 12:00:00 AM","Value":20},{"Key":"6/23/2010 12:00:00 AM","Value":10},{"Key":"6/24/2010 12:00:00 AM","Value":22},{"Key":"6/25/2010 12:00:00 AM","Value":2},{"Key":"6/28/2010 12:00:00 AM","Value":19},{"Key":"6/29/2010 12:00:00 AM","Value":8},{"Key":"6/30/2010 12:00:00 AM","Value":23},{"Key":"7/1/2010 12:00:00 AM","Value":17},{"Key":"7/2/2010 12:00:00 AM","Value":10},{"Key":"7/6/2010 12:00:00 AM","Value":21},{"Key":"7/7/2010 12:00:00 AM","Value":36},{"Key":"7/8/2010 12:00:00 AM","Value":19},{"Key":"7/9/2010 12:00:00 AM","Value":10},{"Key":"7/12/2010 12:00:00 AM","Value":28},{"Key":"7/13/2010 12:00:00 AM","Value":9},{"Key":"7/14/2010 12:00:00 AM","Value":5},{"Key":"7/15/2010 12:00:00 AM","Value":8},{"Key":"7/16/2010 12:00:00 AM","Value":4},{"Key":"7/19/2010 12:00:00 AM","Value":15},{"Key":"7/20/2010 12:00:00 AM","Value":17},{"Key":"7/21/2010 12:00:00 AM","Value":14},{"Key":"7/22/2010 12:00:00 AM","Value":25},{"Key":"7/23/2010 12:00:00 AM","Value":4},{"Key":"7/26/2010 12:00:00 AM","Value":17},{"Key":"7/27/2010 12:00:00 AM","Value":22},{"Key":"7/28/2010 12:00:00 AM","Value":22},{"Key":"7/29/2010 12:00:00 AM","Value":20},{"Key":"7/30/2010 12:00:00 AM","Value":5},{"Key":"8/2/2010 12:00:00 AM","Value":18},{"Key":"8/3/2010 12:00:00 AM","Value":20},{"Key":"8/4/2010 12:00:00 AM","Value":14},{"Key":"8/5/2010 12:00:00 AM","Value":28},{"Key":"8/6/2010 12:00:00 AM","Value":4},{"Key":"8/9/2010 12:00:00 AM","Value":18},{"Key":"8/10/2010 12:00:00 AM","Value":17},{"Key":"8/11/2010 12:00:00 AM","Value":16},{"Key":"8/12/2010 12:00:00 AM","Value":27},{"Key":"8/13/2010 12:00:00 AM","Value":10},{"Key":"8/16/2010 12:00:00 AM","Value":21},{"Key":"8/17/2010 12:00:00 AM","Value":24},{"Key":"8/18/2010 12:00:00 AM","Value":25},{"Key":"8/19/2010 12:00:00 AM","Value":24},{"Key":"8/20/2010 12:00:00 AM","Value":8},{"Key":"8/23/2010 12:00:00 AM","Value":4},{"Key":"8/24/2010 12:00:00 AM","Value":6},{"Key":"8/25/2010 12:00:00 AM","Value":9},{"Key":"8/26/2010 12:00:00 AM","Value":8},{"Key":"8/27/2010 12:00:00 AM","Value":13},{"Key":"8/29/2010 12:00:00 AM","Value":3},{"Key":"8/30/2010 12:00:00 AM","Value":42},{"Key":"8/31/2010 12:00:00 AM","Value":40},{"Key":"9/1/2010 12:00:00 AM","Value":49},{"Key":"9/2/2010 12:00:00 AM","Value":34},{"Key":"9/3/2010 12:00:00 AM","Value":32},{"Key":"9/4/2010 12:00:00 AM","Value":8},{"Key":"9/5/2010 12:00:00 AM","Value":13},{"Key":"9/6/2010 12:00:00 AM","Value":1},{"Key":"9/7/2010 12:00:00 AM","Value":52},{"Key":"9/8/2010 12:00:00 AM","Value":40},{"Key":"9/9/2010 12:00:00 AM","Value":16},{"Key":"9/10/2010 12:00:00 AM","Value":15},{"Key":"9/11/2010 12:00:00 AM","Value":5},{"Key":"9/12/2010 12:00:00 AM","Value":20},{"Key":"9/13/2010 12:00:00 AM","Value":63},{"Key":"9/14/2010 12:00:00 AM","Value":44},{"Key":"9/15/2010 12:00:00 AM","Value":54},{"Key":"9/16/2010 12:00:00 AM","Value":54},{"Key":"9/17/2010 12:00:00 AM","Value":32},{"Key":"9/18/2010 12:00:00 AM","Value":18},{"Key":"9/19/2010 12:00:00 AM","Value":30},{"Key":"9/20/2010 12:00:00 AM","Value":63},{"Key":"9/21/2010 12:00:00 AM","Value":60},{"Key":"9/22/2010 12:00:00 AM","Value":68},{"Key":"9/23/2010 12:00:00 AM","Value":57},{"Key":"9/24/2010 12:00:00 AM","Value":39},{"Key":"9/25/2010 12:00:00 AM","Value":17},{"Key":"9/26/2010 12:00:00 AM","Value":38},{"Key":"9/27/2010 12:00:00 AM","Value":69},{"Key":"9/28/2010 12:00:00 AM","Value":75},{"Key":"9/29/2010 12:00:00 AM","Value":80},{"Key":"9/30/2010 12:00:00 AM","Value":64},{"Key":"10/1/2010 12:00:00 AM","Value":39},{"Key":"10/2/2010 12:00:00 AM","Value":19},{"Key":"10/3/2010 12:00:00 AM","Value":42},{"Key":"10/4/2010 12:00:00 AM","Value":73},{"Key":"10/5/2010 12:00:00 AM","Value":65},{"Key":"10/6/2010 12:00:00 AM","Value":73},{"Key":"10/7/2010 12:00:00 AM","Value":46},{"Key":"10/8/2010 12:00:00 AM","Value":29},{"Key":"10/9/2010 12:00:00 AM","Value":8},{"Key":"10/10/2010 12:00:00 AM","Value":24},{"Key":"10/11/2010 12:00:00 AM","Value":67},{"Key":"10/12/2010 12:00:00 AM","Value":63},{"Key":"10/13/2010 12:00:00 AM","Value":78},{"Key":"10/14/2010 12:00:00 AM","Value":69},{"Key":"10/15/2010 12:00:00 AM","Value":37},{"Key":"10/16/2010 12:00:00 AM","Value":24},{"Key":"10/17/2010 12:00:00 AM","Value":43},{"Key":"10/18/2010 12:00:00 AM","Value":74},{"Key":"10/19/2010 12:00:00 AM","Value":75},{"Key":"10/20/2010 12:00:00 AM","Value":76},{"Key":"10/21/2010 12:00:00 AM","Value":73},{"Key":"10/22/2010 12:00:00 AM","Value":33},{"Key":"10/23/2010 12:00:00 AM","Value":20},{"Key":"10/24/2010 12:00:00 AM","Value":39},{"Key":"10/25/2010 12:00:00 AM","Value":60},{"Key":"10/26/2010 12:00:00 AM","Value":65},{"Key":"10/27/2010 12:00:00 AM","Value":76},{"Key":"10/28/2010 12:00:00 AM","Value":64},{"Key":"10/29/2010 12:00:00 AM","Value":34},{"Key":"10/30/2010 12:00:00 AM","Value":18},{"Key":"10/31/2010 12:00:00 AM","Value":34},{"Key":"11/1/2010 12:00:00 AM","Value":66},{"Key":"11/2/2010 12:00:00 AM","Value":65},{"Key":"11/3/2010 12:00:00 AM","Value":73},{"Key":"11/4/2010 12:00:00 AM","Value":57},{"Key":"11/5/2010 12:00:00 AM","Value":39},{"Key":"11/6/2010 12:00:00 AM","Value":23},{"Key":"11/7/2010 12:00:00 AM","Value":31},{"Key":"11/8/2010 12:00:00 AM","Value":65},{"Key":"11/9/2010 12:00:00 AM","Value":63},{"Key":"11/10/2010 12:00:00 AM","Value":85},{"Key":"11/11/2010 12:00:00 AM","Value":70},{"Key":"11/12/2010 12:00:00 AM","Value":41},{"Key":"11/13/2010 12:00:00 AM","Value":20},{"Key":"11/14/2010 12:00:00 AM","Value":32},{"Key":"11/15/2010 12:00:00 AM","Value":59},{"Key":"11/16/2010 12:00:00 AM","Value":65},{"Key":"11/17/2010 12:00:00 AM","Value":65},{"Key":"11/18/2010 12:00:00 AM","Value":56},{"Key":"11/19/2010 12:00:00 AM","Value":35},{"Key":"11/20/2010 12:00:00 AM","Value":19},{"Key":"11/21/2010 12:00:00 AM","Value":35},{"Key":"11/22/2010 12:00:00 AM","Value":58},{"Key":"11/23/2010 12:00:00 AM","Value":50},{"Key":"11/24/2010 12:00:00 AM","Value":14},{"Key":"11/28/2010 12:00:00 AM","Value":25},{"Key":"11/29/2010 12:00:00 AM","Value":62},{"Key":"11/30/2010 12:00:00 AM","Value":69},{"Key":"12/1/2010 12:00:00 AM","Value":73},{"Key":"12/2/2010 12:00:00 AM","Value":67},{"Key":"12/3/2010 12:00:00 AM","Value":39},{"Key":"12/4/2010 12:00:00 AM","Value":24},{"Key":"12/5/2010 12:00:00 AM","Value":39},{"Key":"12/6/2010 12:00:00 AM","Value":66},{"Key":"12/7/2010 12:00:00 AM","Value":69},{"Key":"12/8/2010 12:00:00 AM","Value":69},{"Key":"12/9/2010 12:00:00 AM","Value":60},{"Key":"12/10/2010 12:00:00 AM","Value":57},{"Key":"12/11/2010 12:00:00 AM","Value":47},{"Key":"12/12/2010 12:00:00 AM","Value":51},{"Key":"12/13/2010 12:00:00 AM","Value":66},{"Key":"12/14/2010 12:00:00 AM","Value":58},{"Key":"12/15/2010 12:00:00 AM","Value":52},{"Key":"12/16/2010 12:00:00 AM","Value":54},{"Key":"12/17/2010 12:00:00 AM","Value":20},{"Key":"12/18/2010 12:00:00 AM","Value":5},{"Key":"12/19/2010 12:00:00 AM","Value":19},{"Key":"12/20/2010 12:00:00 AM","Value":15},{"Key":"1/3/2011 12:00:00 AM","Value":5},{"Key":"1/4/2011 12:00:00 AM","Value":8},{"Key":"1/5/2011 12:00:00 AM","Value":9},{"Key":"1/6/2011 12:00:00 AM","Value":5},{"Key":"1/7/2011 12:00:00 AM","Value":4},{"Key":"1/10/2011 12:00:00 AM","Value":7},{"Key":"1/11/2011 12:00:00 AM","Value":4},{"Key":"1/13/2011 12:00:00 AM","Value":3},{"Key":"1/14/2011 12:00:00 AM","Value":3},{"Key":"1/18/2011 12:00:00 AM","Value":6},{"Key":"1/19/2011 12:00:00 AM","Value":6},{"Key":"1/20/2011 12:00:00 AM","Value":4},{"Key":"1/21/2011 12:00:00 AM","Value":5},{"Key":"1/24/2011 12:00:00 AM","Value":2},{"Key":"1/25/2011 12:00:00 AM","Value":8},{"Key":"1/26/2011 12:00:00 AM","Value":2},{"Key":"1/27/2011 12:00:00 AM","Value":1},{"Key":"1/28/2011 12:00:00 AM","Value":7},{"Key":"1/31/2011 12:00:00 AM","Value":18},{"Key":"2/1/2011 12:00:00 AM","Value":31},{"Key":"2/2/2011 12:00:00 AM","Value":35},{"Key":"2/3/2011 12:00:00 AM","Value":34},{"Key":"2/4/2011 12:00:00 AM","Value":14},{"Key":"2/5/2011 12:00:00 AM","Value":14},{"Key":"2/6/2011 12:00:00 AM","Value":16},{"Key":"2/7/2011 12:00:00 AM","Value":64},{"Key":"2/8/2011 12:00:00 AM","Value":50}]}
    array = {"Title":"Reservations By Date","Items":[{"Key":"1/21/2010 12:00:00 AM","Value":124},{"Key":"1/22/2010 12:00:00 AM","Value":5},{"Key":"1/24/2010 12:00:00 AM","Value":1},{"Key":"1/25/2010 12:00:00 AM","Value":37},{"Key":"1/26/2010 12:00:00 AM","Value":42},{"Key":"1/27/2010 12:00:00 AM","Value":42},{"Key":"1/28/2010 12:00:00 AM","Value":32},{"Key":"1/29/2010 12:00:00 AM","Value":19},{"Key":"1/30/2010 12:00:00 AM","Value":10},{"Key":"1/31/2010 12:00:00 AM","Value":17},{"Key":"2/1/2010 12:00:00 AM","Value":44},{"Key":"2/2/2010 12:00:00 AM","Value":36},{"Key":"2/3/2010 12:00:00 AM","Value":42},{"Key":"2/4/2010 12:00:00 AM","Value":39},{"Key":"2/5/2010 12:00:00 AM","Value":26},{"Key":"2/6/2010 12:00:00 AM","Value":11},{"Key":"2/7/2010 12:00:00 AM","Value":21},{"Key":"2/8/2010 12:00:00 AM","Value":52},{"Key":"2/9/2010 12:00:00 AM","Value":48},{"Key":"2/10/2010 12:00:00 AM","Value":3},{"Key":"2/11/2010 12:00:00 AM","Value":36},{"Key":"2/12/2010 12:00:00 AM","Value":27},{"Key":"2/13/2010 12:00:00 AM","Value":14},{"Key":"2/14/2010 12:00:00 AM","Value":22},{"Key":"2/15/2010 12:00:00 AM","Value":56},{"Key":"2/16/2010 12:00:00 AM","Value":53},{"Key":"2/17/2010 12:00:00 AM","Value":67},{"Key":"2/18/2010 12:00:00 AM","Value":58},{"Key":"2/19/2010 12:00:00 AM","Value":33},{"Key":"2/20/2010 12:00:00 AM","Value":18},{"Key":"2/21/2010 12:00:00 AM","Value":37},{"Key":"2/22/2010 12:00:00 AM","Value":68},{"Key":"2/23/2010 12:00:00 AM","Value":51},{"Key":"2/24/2010 12:00:00 AM","Value":56},{"Key":"2/25/2010 12:00:00 AM","Value":50},{"Key":"2/26/2010 12:00:00 AM","Value":7},{"Key":"2/27/2010 12:00:00 AM","Value":20},{"Key":"2/28/2010 12:00:00 AM","Value":37},{"Key":"3/1/2010 12:00:00 AM","Value":43},{"Key":"3/2/2010 12:00:00 AM","Value":59},{"Key":"3/3/2010 12:00:00 AM","Value":50},{"Key":"3/4/2010 12:00:00 AM","Value":63},{"Key":"3/5/2010 12:00:00 AM","Value":29},{"Key":"3/6/2010 12:00:00 AM","Value":7},{"Key":"3/7/2010 12:00:00 AM","Value":33},{"Key":"3/8/2010 12:00:00 AM","Value":57},{"Key":"3/9/2010 12:00:00 AM","Value":47},{"Key":"3/10/2010 12:00:00 AM","Value":65},{"Key":"3/11/2010 12:00:00 AM","Value":51},{"Key":"3/12/2010 12:00:00 AM","Value":39},{"Key":"3/13/2010 12:00:00 AM","Value":14},{"Key":"3/14/2010 12:00:00 AM","Value":36},{"Key":"3/15/2010 12:00:00 AM","Value":66},{"Key":"3/16/2010 12:00:00 AM","Value":58},{"Key":"3/17/2010 12:00:00 AM","Value":67},{"Key":"3/18/2010 12:00:00 AM","Value":50},{"Key":"3/19/2010 12:00:00 AM","Value":36},{"Key":"3/20/2010 12:00:00 AM","Value":14},{"Key":"3/21/2010 12:00:00 AM","Value":47},{"Key":"3/22/2010 12:00:00 AM","Value":67}]}
   
    array2 = {"Title":"Reservations By Date","Items":[{"Key":"11/23/2011 12:00:00 AM","Value":1},{"Key":"11/27/2011 12:00:00 AM","Value":21},{"Key":"11/28/2011 12:00:00 AM","Value":67},{"Key":"11/29/2011 12:00:00 AM","Value":63},{"Key":"11/30/2011 12:00:00 AM","Value":73},{"Key":"12/1/2011 12:00:00 AM","Value":55},{"Key":"12/2/2011 12:00:00 AM","Value":35},{"Key":"12/3/2011 12:00:00 AM","Value":20},{"Key":"12/4/2011 12:00:00 AM","Value":41},{"Key":"12/5/2011 12:00:00 AM","Value":79},{"Key":"12/6/2011 12:00:00 AM","Value":60},{"Key":"12/7/2011 12:00:00 AM","Value":62},{"Key":"12/8/2011 12:00:00 AM","Value":58},{"Key":"12/9/2011 12:00:00 AM","Value":49},{"Key":"12/10/2011 12:00:00 AM","Value":46},{"Key":"12/11/2011 12:00:00 AM","Value":53},{"Key":"12/12/2011 12:00:00 AM","Value":81},{"Key":"12/13/2011 12:00:00 AM","Value":66},{"Key":"12/14/2011 12:00:00 AM","Value":69},{"Key":"12/15/2011 12:00:00 AM","Value":74},{"Key":"12/16/2011 12:00:00 AM","Value":54},{"Key":"12/17/2011 12:00:00 AM","Value":37},{"Key":"12/18/2011 12:00:00 AM","Value":48},{"Key":"12/19/2011 12:00:00 AM","Value":74},{"Key":"12/20/2011 12:00:00 AM","Value":26},{"Key":"12/27/2011 12:00:00 AM","Value":2},{"Key":"12/28/2011 12:00:00 AM","Value":1},{"Key":"12/29/2011 12:00:00 AM","Value":1},{"Key":"1/3/2012 12:00:00 AM","Value":2},{"Key":"1/4/2012 12:00:00 AM","Value":8},{"Key":"1/5/2012 12:00:00 AM","Value":6},{"Key":"1/6/2012 12:00:00 AM","Value":5},{"Key":"1/9/2012 12:00:00 AM","Value":3},{"Key":"1/10/2012 12:00:00 AM","Value":6},{"Key":"1/11/2012 12:00:00 AM","Value":5},{"Key":"1/12/2012 12:00:00 AM","Value":6},{"Key":"1/13/2012 12:00:00 AM","Value":10},{"Key":"1/16/2012 12:00:00 AM","Value":1},{"Key":"1/17/2012 12:00:00 AM","Value":3},{"Key":"1/18/2012 12:00:00 AM","Value":5},{"Key":"1/19/2012 12:00:00 AM","Value":4},{"Key":"1/20/2012 12:00:00 AM","Value":3},{"Key":"1/22/2012 12:00:00 AM","Value":1},{"Key":"1/23/2012 12:00:00 AM","Value":29},{"Key":"1/24/2012 12:00:00 AM","Value":14},{"Key":"1/25/2012 12:00:00 AM","Value":40},{"Key":"1/26/2012 12:00:00 AM","Value":35},{"Key":"1/27/2012 12:00:00 AM","Value":21},{"Key":"1/28/2012 12:00:00 AM","Value":9},{"Key":"1/29/2012 12:00:00 AM","Value":25},{"Key":"1/30/2012 12:00:00 AM","Value":45},{"Key":"1/31/2012 12:00:00 AM","Value":33},{"Key":"2/1/2012 12:00:00 AM","Value":47},{"Key":"2/2/2012 12:00:00 AM","Value":49},{"Key":"2/3/2012 12:00:00 AM","Value":24},{"Key":"2/4/2012 12:00:00 AM","Value":15},{"Key":"2/5/2012 12:00:00 AM","Value":22},{"Key":"2/6/2012 12:00:00 AM","Value":53},{"Key":"2/7/2012 12:00:00 AM","Value":51},{"Key":"2/8/2012 12:00:00 AM","Value":50},{"Key":"2/9/2012 12:00:00 AM","Value":42},{"Key":"2/10/2012 12:00:00 AM","Value":29},{"Key":"2/11/2012 12:00:00 AM","Value":17},{"Key":"2/12/2012 12:00:00 AM","Value":31},{"Key":"2/13/2012 12:00:00 AM","Value":56},{"Key":"2/14/2012 12:00:00 AM","Value":47},{"Key":"2/15/2012 12:00:00 AM","Value":65},{"Key":"2/16/2012 12:00:00 AM","Value":53},{"Key":"2/17/2012 12:00:00 AM","Value":37},{"Key":"2/18/2012 12:00:00 AM","Value":21},{"Key":"2/19/2012 12:00:00 AM","Value":33},{"Key":"2/20/2012 12:00:00 AM","Value":59},{"Key":"2/21/2012 12:00:00 AM","Value":55},{"Key":"2/22/2012 12:00:00 AM","Value":74},{"Key":"2/23/2012 12:00:00 AM","Value":60},{"Key":"2/24/2012 12:00:00 AM","Value":42},{"Key":"2/25/2012 12:00:00 AM","Value":15},{"Key":"2/26/2012 12:00:00 AM","Value":27},{"Key":"2/27/2012 12:00:00 AM","Value":68},{"Key":"2/28/2012 12:00:00 AM","Value":65},{"Key":"2/29/2012 12:00:00 AM","Value":65},{"Key":"3/1/2012 12:00:00 AM","Value":48},{"Key":"3/2/2012 12:00:00 AM","Value":33},{"Key":"3/3/2012 12:00:00 AM","Value":11},{"Key":"3/4/2012 12:00:00 AM","Value":31},{"Key":"3/5/2012 12:00:00 AM","Value":67},{"Key":"3/6/2012 12:00:00 AM","Value":49},{"Key":"3/7/2012 12:00:00 AM","Value":59},{"Key":"3/8/2012 12:00:00 AM","Value":55},{"Key":"3/9/2012 12:00:00 AM","Value":32},{"Key":"3/10/2012 12:00:00 AM","Value":14},{"Key":"3/11/2012 12:00:00 AM","Value":45},{"Key":"3/12/2012 12:00:00 AM","Value":56},{"Key":"3/13/2012 12:00:00 AM","Value":58},{"Key":"3/14/2012 12:00:00 AM","Value":55},{"Key":"3/15/2012 12:00:00 AM","Value":53},{"Key":"3/16/2012 12:00:00 AM","Value":36},{"Key":"3/17/2012 12:00:00 AM","Value":12},{"Key":"3/18/2012 12:00:00 AM","Value":37},{"Key":"3/19/2012 12:00:00 AM","Value":63},{"Key":"3/20/2012 12:00:00 AM","Value":63},{"Key":"3/21/2012 12:00:00 AM","Value":74},{"Key":"3/22/2012 12:00:00 AM","Value":55},{"Key":"3/23/2012 12:00:00 AM","Value":37},{"Key":"3/24/2012 12:00:00 AM","Value":13},{"Key":"3/25/2012 12:00:00 AM","Value":32},{"Key":"3/26/2012 12:00:00 AM","Value":59},{"Key":"3/27/2012 12:00:00 AM","Value":54},{"Key":"3/28/2012 12:00:00 AM","Value":62},{"Key":"3/29/2012 12:00:00 AM","Value":34},{"Key":"3/30/2012 12:00:00 AM","Value":14},{"Key":"4/2/2012 12:00:00 AM","Value":1},{"Key":"4/7/2012 12:00:00 AM","Value":1},{"Key":"4/8/2012 12:00:00 AM","Value":8},{"Key":"4/9/2012 12:00:00 AM","Value":61},{"Key":"4/10/2012 12:00:00 AM","Value":55},{"Key":"4/11/2012 12:00:00 AM","Value":67},{"Key":"4/12/2012 12:00:00 AM","Value":51},{"Key":"4/13/2012 12:00:00 AM","Value":28},{"Key":"4/14/2012 12:00:00 AM","Value":17},{"Key":"4/15/2012 12:00:00 AM","Value":38},{"Key":"4/16/2012 12:00:00 AM","Value":53},{"Key":"4/17/2012 12:00:00 AM","Value":55},{"Key":"4/18/2012 12:00:00 AM","Value":63},{"Key":"4/19/2012 12:00:00 AM","Value":42},{"Key":"4/20/2012 12:00:00 AM","Value":21},{"Key":"4/21/2012 12:00:00 AM","Value":13},{"Key":"4/22/2012 12:00:00 AM","Value":32},{"Key":"4/23/2012 12:00:00 AM","Value":71},{"Key":"4/24/2012 12:00:00 AM","Value":54},{"Key":"4/25/2012 12:00:00 AM","Value":67},{"Key":"4/26/2012 12:00:00 AM","Value":50},{"Key":"4/27/2012 12:00:00 AM","Value":31},{"Key":"4/28/2012 12:00:00 AM","Value":16},{"Key":"4/29/2012 12:00:00 AM","Value":35},{"Key":"4/30/2012 12:00:00 AM","Value":55},{"Key":"5/1/2012 12:00:00 AM","Value":61},{"Key":"5/2/2012 12:00:00 AM","Value":69},{"Key":"5/3/2012 12:00:00 AM","Value":52},{"Key":"5/4/2012 12:00:00 AM","Value":46},{"Key":"5/5/2012 12:00:00 AM","Value":17},{"Key":"5/6/2012 12:00:00 AM","Value":38},{"Key":"5/7/2012 12:00:00 AM","Value":68},{"Key":"5/8/2012 12:00:00 AM","Value":74},{"Key":"5/9/2012 12:00:00 AM","Value":80},{"Key":"5/10/2012 12:00:00 AM","Value":72},{"Key":"5/11/2012 12:00:00 AM","Value":39},{"Key":"5/12/2012 12:00:00 AM","Value":20},{"Key":"5/13/2012 12:00:00 AM","Value":39},{"Key":"5/14/2012 12:00:00 AM","Value":51},{"Key":"5/15/2012 12:00:00 AM","Value":11},{"Key":"5/16/2012 12:00:00 AM","Value":1},{"Key":"5/17/2012 12:00:00 AM","Value":1},{"Key":"5/25/2012 12:00:00 AM","Value":1},{"Key":"5/29/2012 12:00:00 AM","Value":4},{"Key":"5/30/2012 12:00:00 AM","Value":3},{"Key":"5/31/2012 12:00:00 AM","Value":1},{"Key":"6/5/2012 12:00:00 AM","Value":9},{"Key":"6/6/2012 12:00:00 AM","Value":13},{"Key":"6/7/2012 12:00:00 AM","Value":9},{"Key":"6/8/2012 12:00:00 AM","Value":2},{"Key":"6/11/2012 12:00:00 AM","Value":6},{"Key":"6/12/2012 12:00:00 AM","Value":11},{"Key":"6/13/2012 12:00:00 AM","Value":12},{"Key":"6/14/2012 12:00:00 AM","Value":12},{"Key":"6/15/2012 12:00:00 AM","Value":3},{"Key":"6/18/2012 12:00:00 AM","Value":9},{"Key":"6/19/2012 12:00:00 AM","Value":18},{"Key":"6/20/2012 12:00:00 AM","Value":11},{"Key":"6/21/2012 12:00:00 AM","Value":10},{"Key":"6/22/2012 12:00:00 AM","Value":1},{"Key":"6/25/2012 12:00:00 AM","Value":9},{"Key":"6/26/2012 12:00:00 AM","Value":11},{"Key":"6/27/2012 12:00:00 AM","Value":14},{"Key":"6/28/2012 12:00:00 AM","Value":9},{"Key":"6/29/2012 12:00:00 AM","Value":5},{"Key":"7/2/2012 12:00:00 AM","Value":9},{"Key":"7/3/2012 12:00:00 AM","Value":13},{"Key":"7/5/2012 12:00:00 AM","Value":14},{"Key":"7/6/2012 12:00:00 AM","Value":2},{"Key":"7/9/2012 12:00:00 AM","Value":2},{"Key":"7/10/2012 12:00:00 AM","Value":4},{"Key":"7/11/2012 12:00:00 AM","Value":7},{"Key":"7/12/2012 12:00:00 AM","Value":3},{"Key":"7/13/2012 12:00:00 AM","Value":1},{"Key":"7/16/2012 12:00:00 AM","Value":8},{"Key":"7/17/2012 12:00:00 AM","Value":10},{"Key":"7/18/2012 12:00:00 AM","Value":7},{"Key":"7/19/2012 12:00:00 AM","Value":8},{"Key":"7/20/2012 12:00:00 AM","Value":1},{"Key":"7/23/2012 12:00:00 AM","Value":2},{"Key":"7/24/2012 12:00:00 AM","Value":10},{"Key":"7/25/2012 12:00:00 AM","Value":6},{"Key":"7/26/2012 12:00:00 AM","Value":4},{"Key":"7/30/2012 12:00:00 AM","Value":4}] }
   
    // populate array with all elements
    var alldata = [array, array2]
    var fillcolors = ["blue", "orange", "violet"]
    var dotcolors = ["red", "green", "yellow"]
    // get max value
    var max = 0
    var min = 0 // ASSUMING THE DATA STARTS AS BASE AS ZERO.... CHANGE AS NEEDED DEPENDING ON YOUR DATA
    for (var i =0; i < alldata.length; i++){
        var data = alldata[i]["Items"]
        for (var i = 0; i < data.length; i++){
            if ( data[i]["Value"] > max ) {
                max = data[i]["Value"]
            }
            else if ( data[i]["Value"] < min ) {
                min = data[i]["Value"]
            }
        }
    }
    

    /* SET UP MARGINS AND AXISES  */
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 1000,
        height = 500;
    console.log(min, max);
    console.log(height)
    var x = d3.time.scale()
        .domain([0,data.length])
        .range([0, 500]); // data.length // scale here is a bit off.... (double check when inputting not quantitative values)

    var y = d3.scale.linear()
        .domain([min, max+5]) // $0 to $80
        .range([height, 0]); // svg = y-down // data[0]["Value"]

    //x.domain (d3.extent(data, function(d) { return d["Key"]; }));
    //y.domain (d3.extent(data, function(d) { return d["Value"]; }));


    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

   var svg = d3.select("#" + id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("transform", "translate(0,"+ -5 +")")
      .attr("x", max)
      .attr("dx", ".71em")
      .style("text-anchor", "end")
      .text("Time and Date");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Reservations");


      /* PLOT DATA */
    for (var j = 0; j < alldata.length; j++){
        var data = alldata[j]["Items"]

        var topTitle = alldata[j]["Title"]

        var key = keys[0]; // the one line we want as the x axis <- 

        var i = 0;
        

        d3.selectAll(data).each (function(d,i){
         svg.append("circle")
            .datum(this)
            //.attr("cx",35)
            //.attr("cy",5)
            .attr("r", 5)
            .attr("cx", function(d) {i +=1;return x(i);})
            .attr("cy", function(d){return y(d["Value"])})
            .attr("id",function(d){return "circle"+i})
            .style("fill", dotcolors[j])
            .on("mouseover", function(d){
               //console.log(this.parentNode)
               
                var circle = d3.select(this)
                
                console.log(circle[0][0].cx.baseVal.valueAsString)

                var x = parseInt(circle[0][0].cx.baseVal.valueAsString) -1 + ""
                var y = parseInt(circle[0][0].cy.baseVal.valueAsString)  - 10 + "" 
                var group = d3.select(this.parentNode)
                .append("g")
                              
                if (d3.select("#text" + i)[0][0] != null){
                    d3.select("#text" + i)
                    .attr("class", "visible")
                    .attr("x", x)
                    .attr("y", y)
                   
                }
                else{
                group
                .append("text")
                .attr("id", "text"+i)
                .attr("class", "visible")
                .attr("x", x)
                .attr("y", y)
                .text( d["Value"] )
                .style("fill", dotcolors[0])
                .style("font-size","1.2em")
               
                }   
            })
            .on("mouseout", function(d){
                d3.select("#text"+i)
                .attr("class", "invisible")
            })
    
        })

    }
}



var makeRectangularHeatMap = function(array, keys, id){
        var data = array["Items"]
        var topTitle = array["Title"]

        var key = keys[0]; // the one line we want
        //http://www.w3schools.com/colors/colors_picker.asp
        var redspectrum = ["#000000", "#330000","#660000", "#990000", "#cc0000", "#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ffffff"]

        var margin = {top:20, right:20, left:20, bottom:20},
            width = 1000,
            height = 500

        var svg = d3.select("#" + id)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

        // get max value
        var max = 0
        for (var i = 0; i < data.length; i++){
            if ( data[i]["Value"] > max ) {
                max = data[i]["Value"]
            }
        }

        // min is assumed zero.

        //scale 



        // 7 column with however many rows as needed... node size should shrink with overabundance of rows 




    }

