var palettes = ["#B81414", "#DA8035", "#003B00", "#0C6F6F"]
var light = ["#208383", "#2BAE"]

var light = ["#FB6C73", "#C4000E", "#5ACF5A", "#45A0A0", "#7D56B3", "#5F5FB8", "#910000", "#079107", "#0D0D65"]
var dark = ["#9100", "#079107", "#2dF762", "#0D0D65"]

var flat = ["#c0392b", "#8e44ad", "#f39c12", "#1abc9c", "#d35400", "#2980b9", "#e74c3c", "#2c3e50", "#2ecc71", "#f1c40f", "#c00cb4", "#16a085", "#7f8c8d"]
var fontsize = 20

// from 6 - 30 missing a couple numbers from 19-30 so look at the chart before setting font size
var fontconverter = {6:8, 7:9, 8:11, 9:12, 10:13, 11:15, 12:16, 13:18, 14:19, 15:21, 16:22, 17:23, 18:24, 19 : 25, 20:26, 22:29, 24:32, 26:35, 27:36, 29:38, 30:40 }

// pie chart creator
var d3piecharts = function (data, id_key){
    var myPie = new d3pie(id_key,data);
}

// Static horizontalBar with pure Canvas- No animation
// the array is the data that should look like this: 

var tablefy = function (array, id, key_title, value_title){
    key_title = key_title == undefined ? "" : key_title
    value_title = value_title == undefined ? "" : value_title

    var x = document.createElement("table");
    x.className="table table-striped"
   
    var thead = document.createElement("thead")
    var headertr = document.createElement("tr")
    var Key = document.createElement("th")
        Key.textContent = key_title
    var Value = document.createElement("th")
            Value.textContent = value_title
    headertr.appendChild(Key)
    headertr.appendChild(Value)
    thead.appendChild(headertr)
    x.appendChild(thead)
    var tbody = document.createElement("tbody")
    for (var j = 0; j < array.length; j++){
        var y = document.createElement("tr");
        var z = document.createElement("td");
        z.textContent = array[j]["Key"] 
        var zz = document.createElement("td");
        zz.textContent = array[j]["Value"] 
        y.appendChild(z);
        y.appendChild(zz);
        tbody.appendChild(y)
    }
    x.appendChild(tbody);
    var parent = document.getElementById(id)
    parent.appendChild(x);
}
var makeHorizontalBars = function (array, id, colors=[], width=1000, height=500) {
    // get data
    var data = array["Items"]
    var topTitle = array["Title"]
    var n = data.length
    if (data.length == 0){
        console.log("Empty Data")
        return 0;
    }

    if (colors.length == 0){
        colors = flat;
    }
    // set up the container properties
    var container = document.getElementById(id);
    var canvas = document.createElement('canvas');

    // set width and height of canvas 
    // if there are too many bars (like reasonable 20) -> make taller, 
    //else if its too much data... this is not the right graph to use
    canvas.width = width;
    canvas.height = height;
  
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
    var startX = linewidth + 300; // line width and space for text //maxTitleLength*10
    var startY = 10-spacing/2 + 50; // + 50 to account for title
    var graphH = (totalH - 2*linewidth - n*spacing) // may want to consider shortening total height for room for 
    var graphW = totalW - 2*linewidth - 100 // for end space for number and percentage
    var barlength = (totalW - 600) / data[0]["Value"] //maxTitleLength*10


    for (var i = 0; i < data.length; i++) {
        total += parseFloat(data[i]["Value"]);
    }

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
    var graphwidth = graphW - startX + 10;
   
  
    startY += spacing;
    var m = 0;
    //create bars in the graph
    while (m < n) {
        ctx.fillStyle = colors[m%colors.length]
        var w = data[m]["Value"]
        ctx.fillRect(startX, startY, graphwidth*w/total, h);
        ctx.font = fontsize+"px Arial";
        ctx.textAlign = "right";
        ctx.fillText(data[m]["Key"], startX - linewidth * 2, startY+h/2 + fontsize/4);
        ctx.textAlign = "left";
        ctx.fillText(w + " || " + percent (w, total) , startX + graphwidth*w/total + 10, startY+h/2+fontsize/4);// - half of font size
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
        var percent = Math.round(n / total * 10000)/100;
        return percent + "%"
    }

    var getMonth_Date_Year  = function (date_object){
        return date_object.getMonth() + " " + date_object.getDate() + " " + date_object.getYear()
    }


    // scatter plot with support for multiple data sets
    // for now, there is a limited amount of colors available. If you want to differentiate a graph from another, separate points and add as another element of an array
    // if num_data is 1 or empty, you can omit the array brackets surrounding the data (omit nesting)

    // array can be either an array with all the data or a single dictionary in the correct data form
    // keys is the dictionary with all the options <- size, data, etc
    // num_data - flag for if array variable Multiple data in dictionaries [not 1] or if it is only one dictonary [1]
    // id of div to append to
    // colors is a 2d array with an array for fill colors and dot colors
    var scatterplot = function (chartinfo, id){
        // take care of rendering title and id
        var graph_id = chartinfo.header.id == undefined ? "soloChart" : chartinfo.header.id
        var graph_title = chartinfo.header.title.text


        // assume content all data is an array even if it is only one set <- may be incovenient but increases flexibility for multiline and mutligroups
        var alldata = chartinfo.data.content
        var colors = chartinfo.data.colors
        var point_size = chartinfo.data.point_size == undefined ? 2 : chartinfo.data.point_size
        //var line_size = chartinfo.data.line_size == undefined ? 2 : chartinfo.data.line_size

        var datatype = "num"
        var datelabel_format, tickinterval;
        var tick_datetype;
        var tick_margin_datatype;

        var x_axis_label, y_axis_label;
        if (chartinfo.data.axis_labels == undefined){
            x_axis_label = "x"
            y_axis_label = "y"
        }else{
            x_axis_label = chartinfo.data.axis_labels.x == undefined? "x": chartinfo.data.axis_labels.x
            y_axis_label = chartinfo.data.axis_labels.y == undefined? "y" : chartinfo.data.axis_labels.y
        }
        if (chartinfo.data.graph_tick != undefined){
            datelabel_format = chartinfo.data.graph_tick.label == undefined ? "%Y" : chartinfo.data.graph_tick.label
            tickinterval = chartinfo.data.graph_tick.num_by
            switch(chartinfo.data.graph_tick.date_by) {
                case "day":
                    tick_datetype = d3.time.day
                    tick_margin_datatype = d3.time.day
                    break;
                case "month":
                    tick_datetype = d3.time.month
                    tick_margin_datatype = d3.time.day
                    break;                
                case "year":
                    tick_datetype = d3.time.year
                    tick_margin_datatype = d3.time.month
                    break;
                default:
                    tick_datetype = d3.time.day
                    tick_margin_datatype = d3.time.day
            }
            datatype = "date"
        }

        if (colors.length == 0){ // if colors is empty
            // if any inner colors are empty, set to some default colors
            colors = ["brown", "green", "red"]
        }

        var D = function(n){
            if (datatype  == "date"){
                return new Date(n);
            }else{
                return n;
            }
        }

        // get max value
        var max = alldata[0]["Items"][0]["Value"] // just take the first element of the array
        var min = max // ASSUMING THE DATA STARTS AS BASE AS ZERO.... CHANGE AS NEEDED DEPENDING ON YOUR DATA
        var minData = D(alldata[0]["Items"][0]["Key"]);
        var maxData = minData;

        var totalData = 0;

        // get max value of things
        for (var j = 0; j < alldata.length; j++){

       
            var data = alldata[j]["Items"]
            for (var i = 1; i < data.length; i++){
                // y axis max and min
                if ( data[i]["Value"] > max ) {
                    max = data[i]["Value"]
                }
                else if ( data[i]["Value"] < min ) {
                    min = data[i]["Value"]
                }
                // x axis max and min
                var x_data = D(data[i]["Key"]);
                if (x_data < minData)
                    minData = x_data
            
                if (x_data > maxData)
                    maxData = x_data

            }
            totalData += data.length

        
        }

        /* SET UP MARGINS AND AXISES AND SIZE OF CANVAS */
        var margin = (chartinfo.margin == undefined || chartinfo.margin.top == undefined || chartinfo.margin.right == undefined || chartinfo.margin.left == undefined || chartinfo.margin.bottom == undefined) ? {top: 100, right: 120, bottom: 30, left: 100} : chartinfo.margin
        width = (chartinfo.size== undefined || chartinfo.size.width == undefined) ? 1100 : chartinfo.size.width;
        height = (chartinfo.size== undefined || chartinfo.size.height == undefined) ? 500 : chartinfo.size.height
   
        var x = d3.scale.linear()
            .domain([minData - 1, maxData + 1]) // need to add max and min params
            .range([0, width - margin.right]); 

    
        var y = d3.scale.linear()
           .domain([min-1, max+1])
            .range([height, 0]); 


        var xAxis = d3.svg.axis()
            .scale(x)
            //.ticks(0,100)
            //.ticks(tick_datetype , tickinterval)
            //.tickFormat(d3.time.format(datelabel_format))
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");


        // of the datatype are dates, change functions to ones that convert to dates
        if (datatype == "date")
        {
            x = d3.time.scale()
                .domain([tick_margin_datatype.offset(minData,-1), tick_margin_datatype.offset(maxData,1)])
                .range([0, width - margin.right]);  

            xAxis = d3.svg.axis()
            .scale(x)
            .ticks(tick_datetype , tickinterval)
            .tickFormat(d3.time.format(datelabel_format))
            .orient("bottom");
        }

        var svg = d3.select("#" + id).append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("id",graph_id)
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")" );

        svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .append("text")
          .attr("x", width + 20)
          .attr("transform", "translate(-"+margin.right/2+","+ -5 +")")

          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text(x_axis_label);

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "translate(0, -20)")
          //.attr("transform", "rotate(-90)")
          //.attr("x",100)
          .attr("y", 6)
          .attr("dy", ".71em")
          ///.style("text-anchor", "end")
          .text(y_axis_label);
   
        //add title
        svg.append("text")
         .attr("x", width/2)
         .attr("y",0)
         .text(graph_title)
         .attr("class","graph_title")
         .attr("text-anchor", "middle")
         .style("font-weight", "600")
         .attr("transform", "translate(" + 0 + "," + -margin.top/2 + ")" );



        /* PLOT DATA */
        var element_id = 0
        for (var j = 0; j < alldata.length; j++){
            var data = alldata[j]["Items"]

            //var topTitle = alldata[j]["Title"]       

            d3.selectAll(data).each (function(d,i){
                i = element_id + i
                svg.append("circle")
                   .datum(this)
                   //.attr("cx",35)
                   //.attr("cy",5)
                   .attr("r", point_size )
                   .attr("cx", function(d) {
                       return x(D(d["Key"]));
                   })
                   .attr("cy", function(d){return y(d["Value"])})
                   .attr("id",function(d){return graph_id+"_circle"+i})
                   .attr("fill",  colors[j%colors.length])
                   .style("fill", colors[j%colors.length])
                   .on("mouseover", function(d){
               
                       var circle = d3.select(this)
                       //console.log(circle[0][0].cx.baseVal.valueAsString)

                       var x = parseInt(circle[0][0].cx.baseVal.valueAsString) -1 + ""
                       var y = parseInt(circle[0][0].cy.baseVal.valueAsString) - 10 + "" 
                       var group = d3.select(this.parentNode)
                       .append("g")
    
                       if (d3.select("#"+ graph_id + "_text" + i)[0][0] != null){
                           d3.select("#"+ graph_id + "_text" + i)
                           .attr("class", "visible")
                           .attr("x", x)
                           .attr("y", y)
                           // .attr("fill", d3.select("#"+ graph_id + "_circle"+i)[0][0].style.fill)
                           //.style("color", d3.select("#circle"+i)[0][0].style.fill)
                           .style("color", d3.select("#"+ graph_id + "_circle"+i)[0][0].style.fill)
                           d3.select("#"+ graph_id + "_rect" + i)
                            .attr("class", "visible")
                       }
                       else{

                           group.append("rect")
                           .attr("id",  graph_id + "_rect"+i)
                           .attr("width",160)
                           .attr("height",30)
                           .attr("fill","white")
                           .attr("x", parseInt(x))
                           .attr("y",parseInt(y)-20)
                           .attr("class", "visible")
         
                  
                           group
                               .append("text")
                               .attr("id",  graph_id + "_text"+i)
                               .attr("class", "visible")
                               .attr("x", x)
                               .attr("y", y)
                               //.text( d["Value"] )
                               .text("(" + new Date(d["Key"]).getMonth() +"/"+ new Date(d["Key"]).getDate() +"/"+ new Date(d["Key"]).getFullYear() +" , "+ d["Value"] +")" )
                               .attr("fill", d3.select("#"+ graph_id + "_circle"+i)[0][0].style.fill)
                               .style("font-size","1.2em")
                       }   
                   })
                   .on("mouseout", function(d){
                       d3.select("#"+graph_id +"_text"+i)
                       .attr("class", "invisible")
                       d3.select("#"+ graph_id + "_rect" + i)
                       .attr("class", "invisible")
                   })

                element_id = i
            })
            element_id += 1
        }    
    }
    // array is the array with all the json data 
    // do we have time
    /* Adapted from http://bl.ocks.org/mbostock/3883245 */
    var linegraph = function (chartinfo, id){
        // take care of rendering title and id
        var graph_id = chartinfo.header.id == undefined ? "soloChart" : chartinfo.header.id
        var graph_title = chartinfo.header.title.text

        // assume content all data is an array even if it is only one set <- may be incovenient but increases flexibility for multiline and mutligroups
        var alldata = chartinfo.data.content
        var colors = chartinfo.data.colors
        var point_size = chartinfo.data.point_size == undefined ? 2 : chartinfo.data.point_size
        var line_size = chartinfo.data.line_size == undefined ? 2 : chartinfo.data.line_size

        var datatype = "num"
        var datelabel_format,tickinterval;
   
        var tick_datetype,tick_margin_datatype;

        var x_axis_label, y_axis_label;

        if (chartinfo.data.axis_labels == undefined){
            x_axis_label = "x"
            y_axis_label = "y"
        }else{
            x_axis_label = chartinfo.data.axis_labels.x == undefined? "x": chartinfo.data.axis_labels.x
            y_axis_label = chartinfo.data.axis_labels.y == undefined? "y" : chartinfo.data.axis_labels.y
        }
        
        if (chartinfo.data.graph_tick != undefined){
            datelabel_format = chartinfo.data.graph_tick.label == undefined ? "%Y" : chartinfo.data.graph_tick.label
            tickinterval = chartinfo.data.graph_tick.num_by
            switch(chartinfo.data.graph_tick.date_by) {
                case "day":
                    tick_datetype = d3.time.day
                    tick_margin_datatype = d3.time.day
                    break;
                case "month":
                    tick_datetype = d3.time.month
                    tick_margin_datatype = d3.time.day
                    break;                
                case "year":
                    tick_datetype = d3.time.year
                    tick_margin_datatype = d3.time.month
                    break;
                default:
                    tick_datetype = d3.time.day
                    tick_margin_datatype = d3.time.day
            }
            datatype = "date"
        }
        var D = function(n){
            if (datatype  == "date"){
                return new Date(n);
            }else{
                return n;
            }
        }
        // get max value
        var max = alldata[0]["Items"][0]["Value"] // just take the first element of the array
        var min = max // ASSUMING THE DATA STARTS AS BASE AS ZERO.... CHANGE AS NEEDED DEPENDING ON YOUR DATA
        var minData = D(alldata[0]["Items"][0]["Key"]);
        var maxData = minData;

        var totalData = 0;

        // get max value of things
        for (var j = 0; j < alldata.length; j++){

       
            var data = alldata[j]["Items"]
            for (var i = 1; i < data.length; i++){
                // y axis max and min
                if ( data[i]["Value"] > max ) {
                    max = data[i]["Value"]
                }
                else if ( data[i]["Value"] < min ) {
                    min = data[i]["Value"]
                }
                // x axis max and min
                var x_data = D(data[i]["Key"]);
                if (x_data < minData)
                    minData = x_data
            
                if (x_data > maxData)
                    maxData = x_data

            }
            totalData += data.length
        }

        // set up colors
        if (colors.length == 0){ // if colors is empty
            // if any inner colors are empty, set to some default colors
            colors = [["brown", "green", "red"], ["blue", "orange", "violet"] ]
        }else{
            if (colors[0].length == 0 || colors[1].length == 0)
                // colors = [[dotcolor], [linecolor]] 

                colors = [["brown", "green", "red"], ["blue", "orange", "violet"] ]
        }


        /* SET UP MARGINS AND AXISES  */
        var margin = (chartinfo.margin == undefined || chartinfo.margin.top == undefined || chartinfo.margin.right == undefined || chartinfo.margin.left == undefined || chartinfo.margin.bottom == undefined) ? {top: 100, right: 20, bottom: 30, left: 100} : chartinfo.margin
        width = (chartinfo.size== undefined || chartinfo.size.width == undefined) ? 1100 : chartinfo.size.width;
        height = (chartinfo.size== undefined || chartinfo.size.height == undefined) ? 500 : chartinfo.size.height

        var x = d3.scale.linear()
            .domain([minData - 1, maxData + 1]) // need to add max and min params
            .range([0, width]); 

        var y = d3.scale.linear()
            .domain([min-1, max+1]) // $0 to $80
            .range([height, 0]); // svg = y-down // data[0]["Value"]

        var xAxis = d3.svg.axis()
            .scale(x)
            //.ticks(tick_datetype, 1)
            //.tickFormat(d3.time.format(datelabel_format))
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        // of the datatype are dates, change functions to ones that convert to dates
        if (datatype == "date")
        {
            x = d3.time.scale()
                .domain([tick_margin_datatype.offset(minData,-1), tick_margin_datatype.offset(maxData,1)])
                .range([0, width - margin.right]);   

            xAxis = d3.svg.axis()
            .scale(x)
            .ticks(tick_datetype , tickinterval)
            .tickFormat(d3.time.format(datelabel_format))
            .orient("bottom");
        }


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
          .attr("transform", "translate(-" + margin.right/2 + "," + -5 +")")
          .attr("x", width + 10)
          .attr("dx", ".71em")
          .style("text-anchor", "end")
          .text(x_axis_label);//xaxislabel

        svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "translate(0, -20)")
          //.attr("transform", "rotate(-90)")
          //.attr("x",100)
          .attr("y", 6)
          .attr("dy", ".71em")
          ///.style("text-anchor", "end")
          .text(y_axis_label);
   
   
        //add title
        svg.append("text")
         .attr("x", width/2)
         .attr("y",0)
         .text(graph_title)
         .attr("class","graph_title")
         .attr("text-anchor", "middle")
         .style("font-weight", "600")
         .attr("transform", "translate(" + 0 + "," + -margin.top/2 + ")" );

        /* PLOT DATA */
        var element_id = 0
        for (var j = 0; j < alldata.length; j++){
            var data = alldata[j]["Items"]

            var topTitle = alldata[j]["Title"]       

            var line = d3.svg.line()
                .x(function(d) { return x(D(d["Key"]));} ) // x(d)
                .y(function(d){return y(d["Value"]);}) 

            svg.append("path")
                .datum(data)
                .attr("class", "line")
                .style("stroke",colors[1][j%colors[1].length])
                .style("stroke-width",line_size)
                .style("fill","none")
                .attr("d", line);


            d3.selectAll(data).each (function(d,i){
                i = element_id + i
                svg.append("circle")
                   .datum(this)
                   .attr("r", point_size )
                   .attr("cx", function(d) {return x(D(d["Key"]) );})
                   .attr("cy", function(d){return y(d["Value"])})
                   .attr("id",function(d){return graph_id+"_circle"+i})
                   //.attr("fill", colors[0][j%colors[0].length]) //dotcolor
                   .style("fill", colors[0][j%colors[0].length]) //dotcolor
                   .on("mouseover", function(d){
               
                       var circle = d3.select(this)
                       //console.log(circle[0][0].cx.baseVal.valueAsString)

                       var x = parseInt(circle[0][0].cx.baseVal.valueAsString) -1 + ""
                       var y = parseInt(circle[0][0].cy.baseVal.valueAsString) - 10 + "" 
                       var group = d3.select(this.parentNode)
                       .append("g")
    
                       if (d3.select("#"+ graph_id + "_text" + i)[0][0] != null){
                           d3.select("#"+ graph_id + "_text" + i)
                           .attr("class", "visible")
                           .attr("x", x)
                           .attr("y", y)
                           .style("color", d3.select("#"+ graph_id + "_circle"+i)[0][0].style.fill)

                           d3.select("#"+ graph_id + "_rect" + i)
                           .attr("class", "visible")
                       }
                       else{

                            group.append("rect")
                            .attr("id",  graph_id + "_rect"+i)
                            .attr("width",160)
                            .attr("height",30)
                            .attr("fill","white")
                            .attr("x", parseInt(x))
                            .attr("y",parseInt(y)-20)
                            .attr("class", "visible")
         
                           group
                               .append("text")
                               .attr("id",  graph_id + "_text"+i)
                               .attr("class", "visible")
                               .attr("x", x)
                               .attr("y", y)
                               .text("(" + new Date(d["Key"]).getMonth() +"/"+ new Date(d["Key"]).getDate() +"/"+ new Date(d["Key"]).getFullYear() +" , "+ d["Value"] +")" )
                               .attr("fill", d3.select("#"+ graph_id + "_circle"+i)[0][0].style.fill)
                               .style("font-size","1.1em")
                               .style("font-weight","600")
                               
                           
                       
                          
                       }   
                   })
                   .on("mouseout", function(d){
                       d3.select("#"+graph_id +"_text"+i)
                       .attr("class", "invisible")
                       d3.select("#"+graph_id +"_rect"+i)
                        .attr("class", "invisible")
                      
                       
                   })

                element_id = i
            })
            element_id += 1
        }
    }



    var pie_data_format = function (chartinfo, data, colors=[]){
        converteddata = [] 
        for (var i = data.length-1; i >=0 ; i--){
            d = {}
            d.label = data[i]["Key"]
            if (d.label.trim().length == 0){ // if there's only spaces in the label.... get clean it out
                d.label = "" // if no label, clean out so there are no extraneous lines sticking out
            }
            d.value = parseFloat(data[i]["Value"])
            if (colors.length > 0){
                d.color = colors[i%colors.length]
            }
            converteddata.push(d)

        }
        chartinfo.data = chartinfo.data == undefined? {} : chartinfo.data
        chartinfo.data.content = converteddata
       
        return chartinfo;
    }

