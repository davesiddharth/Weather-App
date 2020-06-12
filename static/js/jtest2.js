var svgWidth = 960;
var svgHeight = 500;

var margin ={
    top: 20,
    right: 40,
    bottom: 90,
    left: 100
};


// Dimensions for chart group
var width= svgWidth-margin.left-margin.right;
var height = svgHeight- margin.top-margin.bottom;


 //Initial chosen axis:
 var chosenXAxis="week" ;
 var chosenYAxis="temp";  


 // Select the button
var button = d3.select(".btn");

// Select the form
var form = d3.select(".form");

// Create event handlers 
button.on("click", plotRunEnter);
form.on("submit",plotRunEnter);

//parsetime
var parseTime=d3.timeParse("%B");

 
//Scaling y axis function
function yScale(weatherData, chosenYAxis){
    var yLinearScale= d3.scaleLinear()
    .domain([d3.min(weatherData, d=>d.main[chosenYAxis])-1,d3.max(weatherData, d=>d.main[chosenYAxis])+1])
    .range([height,0]);

    return yLinearScale;

} 

//rendering the changed axis
function renderAxes(newScale,chosenAxis,axis){
    if (chosenAxis=="three days"|| chosenAxis=="five days"|| chosenAxis=="week"){
        var bottomAxis= d3.axisBottom(newScale);
        axis.transition()
            .duration(1000)
            .call(bottomAxis);
        return axis;
    }
    else if (chosenAxis=="temp"|| chosenAxis=="humidity"|| chosenAxis=="pressure"){
        var leftAxis= d3.axisLeft(newScale);
        axis.transition()
            .duration(1000)
            .call(leftAxis);
        return axis;
    }
}

//rendering the changed circles
function renderCircles(circlesGroup,newScale,chosenAxis){
    if (chosenAxis=="three days"|| chosenAxis=="five days"|| chosenAxis=="week"){
        circlesGroup.transition()
                    .duration(1000)
                    .attr("cx",(d,i) => newScale(i+1));
        return circlesGroup;
    }
    else if (chosenAxis=="temp"|| chosenAxis=="humidity"|| chosenAxis=="pressure"){
        circlesGroup.transition()
        .duration(1000)
        .attr("cy",d => newScale(d.main[chosenAxis]));
        return circlesGroup; 
    }

}

//Updating tooltip function
function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup){
    var xLabel;
    var yLabel;
    if(chosenXAxis === "three days"){
        xLabel ="Three Days";
    }
    else if (chosenXAxis === "five days"){
        xLabel = "Five Days";
    }
    else {xLabel = "A Week";}

    if(chosenYAxis === "temp"){
        yLabel="Temperature(F)";
    }
    else if (chosenYAxis=== "humidity"){
        yLabel = "Humidity(%)";
    }
    else {yLabel= "Pressure";}


    var toolTip =d3.tip()
                    .attr("class","d3-tip")
                    .offset([80,-60])
                    .html(function(d){
                        return (`<strong>${d.name}</strong><br> Date: ${new Date(d.dt*1000)}<br> ${yLabel} : ${d.main[chosenYAxis]}`)
                    });
                    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });

    return circlesGroup;
}

 //function to render the plot
 function plotRunEnter(){
    d3.select("svg").remove();

    // Adding the svg element
      var svg= d3.select("#plot")
                 .append("svg")
                 .attr("width",svgWidth)
                 .attr("height",svgHeight);

//Adding the chart group

var chartGroup = svg.append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);


    d3.event.preventDefault();

    // Select the input element and get the raw HTML node
    var inputElement = d3.select("#city");

    // Get the value property of the input element
    var city_name = inputElement.property("value");

    console.log(city_name);

    var url = `/api/v1.0/weather_data/${city_name}`;
    //console.log(url);
    d3.json(url, function(weatherData){

    //Parse to integer
    weatherData.forEach(d => {
        console.log(d);
        // data.forEach(d=>{
            //console.log(d.main["temp"]);
            // d.dt=parseTime(d.dt);
             //d.dt=new Date(d.dt*1000);
            //console.log(d.dt.getDate());
            d.main.temp =+d.main.temp;
            d.main.humidity=+d.main.humidity;
            d.main.pressure=+d.main.pressure;
        })

    var dataChosen=[];
    for(var i=weatherData.length-7;i<weatherData.length;i++){
                dataChosen.push(weatherData[i]);
    
        }

    var xLinearScale = d3.scaleLinear().domain([0, 7]).range([0, width]);
       
    var yLinearScale= yScale(dataChosen, chosenYAxis);

    //Creating initial Axis
    var bottomAxis= d3.axisBottom(xLinearScale);
    var leftAxis= d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    var yAxis=chartGroup.append("g")
    .call(leftAxis);

    //Create circles
    var circlesGroup=chartGroup.selectAll("circles")
                                .data(dataChosen)
                                .enter()
                                .append("circle")
                                .attr("cx",(d,i) => xLinearScale(i+1))
                                .attr("cy",d => yLinearScale(d.main[chosenYAxis]))
                                .attr("r","10")
                                .attr("fill","green")
                                .attr("opacity","0.75")
                                .classed("stateCircle",true);

    //Adding ToolTip 
   var circlesGroup= updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
    

    //Group for x Axis labels
    var xLabelsGroup= chartGroup.append("g")
                                .attr("transform",`translate(${width / 2}, ${height + 20})`);
    
    var weekLabel = xLabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 20)
                                .attr("value", "week") // value to grab for event listener
                                .classed("active", true)
                                .text("A week");                            


    //Group for y Axis labels
    var yLabelsGroup= chartGroup.append("g")
                               .attr("transform","rotate(-90)");
    
    var tempLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0- margin.left+70)
                                .attr("x", 0-(height/2))
                                .attr("value", "temp") // value to grab for event listener
                                .classed("active", true)
                                .text("Temperature(F)");
    var humidityLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0-margin.left+50)
                                .attr("x", 0-(height/2))
                                .attr("value", "humidity") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Humidity(%)");
    var pressureLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0-margin.left+30)
                                .attr("x", 0-(height/2))
                                .attr("value", "pressure") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Pressure");                            

    yLabelsGroup.selectAll("text")
                .on("click",function(){
        //Getting the value selected
        console.log(chosenXAxis);
            var value =d3.select(this).attr("value");
            if(value !== chosenYAxis){
                //new chosen value
                chosenYAxis= value;
                //rendering the new scale
                yLinearScale=yScale(dataChosen,chosenYAxis);
                //rendering the new axis
                yAxis= renderAxes(yLinearScale,chosenYAxis,yAxis);
                // rendering the new circles and their labels
                circlesGroup= renderCircles(circlesGroup,yLinearScale,chosenYAxis);
                // circlesLabels=renderCircleLabels(circlesLabels,yLinearScale,chosenYAxis);
                
                //Updating the tooltip
                circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

                //change the chosen axis to bold
                if(chosenYAxis ==="humidity"){
                    tempLabel.classed("active",false)
                                .classed("inactive",true);
                    humidityLabel.classed("active",true)
                            .classed("inactive",false);
                    pressureLabel.classed("active",false)
                                .classed("inactive",true);
        
                }
                else if(chosenYAxis ==="pressure"){
                    tempLabel.classed("active",false)
                                .classed("inactive",true);
                    humidityLabel.classed("active",false)
                            .classed("inactive",true);
                    pressureLabel.classed("active",true)
                                .classed("inactive",false);
                                
        
                }
                else if(chosenYAxis ==="temp"){
                    tempLabel.classed("active",true)
                                .classed("inactive",false);
                    humidityLabel.classed("active",false)
                            .classed("inactive",true);
                    pressureLabel.classed("active",false)
                                .classed("inactive",true);
                                
        
                }
        
        }
        })

    })
}

//initialise the plot:
function init(){

    console.log("Initial Plot");
    d3.select("svg").remove();

    // Adding the svg element
      var svg= d3.select("#plot")
                 .append("svg")
                 .attr("width",svgWidth)
                 .attr("height",svgHeight);

//Adding the chart group

var chartGroup = svg.append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

    var city_name="New York"

    console.log(city_name);

    var url = `/api/v1.0/weather_data/${city_name}`;
    //console.log(url);
    d3.json(url, function(weatherData){

    //Parse to integer
    weatherData.forEach(d => {
        console.log(d);
        // data.forEach(d=>{
            //console.log(d.main["temp"]);
            // d.dt=parseTime(d.dt);
             //d.dt=new Date(d.dt*1000);
            //console.log(d.dt.getDate());
            d.main.temp =+d.main.temp;
            d.main.humidity=+d.main.humidity;
            d.main.pressure=+d.main.pressure;
        })

    var dataChosen=[];
    for(var i=weatherData.length-7;i<weatherData.length;i++){
                dataChosen.push(weatherData[i]);
    
        }

    //xlinearScale function
    //var xLinearScale= xScale(weatherData, chosenXAxis);
    var xLinearScale = d3.scaleLinear().domain([0, 7]).range([0, width]);
       
    var yLinearScale= yScale(dataChosen, chosenYAxis);

    //Creating initial Axis
    var bottomAxis= d3.axisBottom(xLinearScale);
    var leftAxis= d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    var yAxis=chartGroup.append("g")
    .call(leftAxis);

    //Create circles
    var circlesGroup=chartGroup.selectAll("circles")
                                .data(dataChosen)
                                .enter()
                                .append("circle")
                                .attr("cx",(d,i) => xLinearScale(i+1))
                                .attr("cy",d => yLinearScale(d.main[chosenYAxis]))
                                .attr("r","10")
                                .attr("fill","green")
                                .attr("opacity","0.75")
                                .classed("stateCircle",true);

    //Adding ToolTip 
   var circlesGroup= updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);
    

    //Group for x Axis labels
    var xLabelsGroup= chartGroup.append("g")
                                .attr("transform",`translate(${width / 2}, ${height + 20})`);
    
    var weekLabel = xLabelsGroup.append("text")
                                .attr("x", 0)
                                .attr("y", 20)
                                .attr("value", "week") // value to grab for event listener
                                .classed("active", true)
                                .text("A week");                            


    //Group for y Axis labels
    var yLabelsGroup= chartGroup.append("g")
                               .attr("transform","rotate(-90)");
    
    var tempLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0- margin.left+70)
                                .attr("x", 0-(height/2))
                                .attr("value", "temp") // value to grab for event listener
                                .classed("active", true)
                                .text("Temperature(F)");
    var humidityLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0-margin.left+50)
                                .attr("x", 0-(height/2))
                                .attr("value", "humidity") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Humidity(%)");
    var pressureLabel = yLabelsGroup.append("text")
    //.attr("transform","rotate(-90)")
                                .attr("y", 0-margin.left+30)
                                .attr("x", 0-(height/2))
                                .attr("value", "pressure") // value to grab for event listener
                                .classed("inactive", true)
                                .text("Pressure");                            

    yLabelsGroup.selectAll("text")
                .on("click",function(){
        //Getting the value selected
        console.log(chosenXAxis);
            var value =d3.select(this).attr("value");
            if(value !== chosenYAxis){
                //new chosen value
                chosenYAxis= value;
                //rendering the new scale
                yLinearScale=yScale(dataChosen,chosenYAxis);
                //rendering the new axis
                yAxis= renderAxes(yLinearScale,chosenYAxis,yAxis);
                // rendering the new circles and their labels
                circlesGroup= renderCircles(circlesGroup,yLinearScale,chosenYAxis);
                // circlesLabels=renderCircleLabels(circlesLabels,yLinearScale,chosenYAxis);
                
                //Updating the tooltip
                circlesGroup=updateToolTip(chosenXAxis,chosenYAxis,circlesGroup);

                //change the chosen axis to bold
                if(chosenYAxis ==="humidity"){
                    tempLabel.classed("active",false)
                                .classed("inactive",true);
                    humidityLabel.classed("active",true)
                            .classed("inactive",false);
                    pressureLabel.classed("active",false)
                                .classed("inactive",true);
        
                }
                else if(chosenYAxis ==="pressure"){
                    tempLabel.classed("active",false)
                                .classed("inactive",true);
                    humidityLabel.classed("active",false)
                            .classed("inactive",true);
                    pressureLabel.classed("active",true)
                                .classed("inactive",false);
                                
        
                }
                else if(chosenYAxis ==="temp"){
                    tempLabel.classed("active",true)
                                .classed("inactive",false);
                    humidityLabel.classed("active",false)
                            .classed("inactive",true);
                    pressureLabel.classed("active",false)
                                .classed("inactive",true);
                                
        
                }
        
        }
        })

    })

}
init();