// call the method below

showScatterPlot(true, true);

function showScatterPlot(show_uc, show_csu) {

    //remove old chart before generating new one
    var overviewChart = d3.select('#overview_scatter_chart');
    overviewChart.selectAll("*").remove();

    var data = filterSchools(show_uc, show_csu);

    d3.json("uc_data.json", function(error, data){
    console.log(data);

    var filteredSchools = data.filter(function(d) { 
      if(d.name.search("UC ") != -1){
        return show_uc;
      }
      else{
        return show_csu;
      }
    });
    data = filteredSchools;

    var margin = {top: 20, right: 20, bottom: 100, left: 70}
      , width = 960 - margin.left - margin.right
      , height = 500 - margin.top - margin.bottom;
    
    var x = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d.median_debt; })-200, d3.max(data, function(d) { return d.median_debt; })])
              .range([ 0, width ]);
    
    var y = d3.scaleLinear()
              .domain([d3.min(data, function(d) { return d.median_earnings; })-1000, d3.max(data, function(d) { return d.median_earnings; })])
              .range([ height, 0 ]);
 
    var chart = d3.select('#overview_scatter_chart')
    .append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')

    var main = chart.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'main')   
        
    // draw the x axis
    main.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .attr('class', 'main axis date')
    .call(d3.axisBottom(x));

    // text label for the x axis
    main.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 50) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "14px") 
      .text("Median Debt");

    // draw the y axis
    main.append('g')
    .attr('transform', 'translate(0,0)')
    .attr('class', 'main axis date')
    .call(d3.axisLeft(y));

    // text label for the y axis
    main.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "14px") 
      .text("Median Earnings");

    var g = main.append("svg:g"); 

    //this variable is declared to show tooltips
    var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    g.selectAll("scatter-dots")
      .data(data)
      .enter().append("svg:circle")
          .attr("class", function (d,i) { 
            if(d.name.search("UC ") != -1){
                return "uc_circle";
            }
            else{
                return "csu_circle";
            }
          }) 
          .attr("cx", function (d,i) { return x(d.median_debt); } )
          .attr("cy", function (d) { return y(d.median_earnings); } )
          .attr("r", function (d) { return d.population / 2000; } )
          .on("mouseover", function(d) {
               div.transition()
                 .duration(200)
                 .style("opacity", .9);
               div.html("<b>"+d.name + "</b><br/><br/>Population: " + d.population + "<br/>Debt: " + d.median_debt + "<br/>Earnings: " + d.median_earnings)
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
            })
         .on("mouseout", function(d) {
               div.transition()
                 .duration(500)
                 .style("opacity", 0);
           })
         .on("click", function(d) {

                var schoolName = d.name;

                //remove old chart before generating new one
                var overviewChart = d3.select('#overview_scatter_chart');
                overviewChart.selectAll("*").remove();
                 

               // var chart = d3.select('#overview_scatter_chart')
               //    .append('svg:svg')
               //    .attr('width', 300)
               //    .attr('height', 300)
               //    .attr('class', 'chart')

               // var circle = d3.select('#overview_scatter_chart')
               //    .append("svg")
               //    .attr("width", 50)
               //    .attr("height", 50)
               //    .append("circle")
               //    .attr("cx", 25)
               //    .attr("cy", 25)
               //    .attr("r", 25)
               //    .attr("class", "uc_circle")
               //    .on("click", function() {
               //        showScatterPlot(show_uc, show_csu);
               //    });

               // chart.append("text")
               //    .attr("x", 100)             
               //    .attr("y", 25)
               //    .attr("text-anchor", "middle")  
               //    .style("font-size", "16px") 
               //    .style("text-decoration", "underline")  
               //    .text(function (d) { return schoolName; });

               console.log(schoolName);

               showBubbleMajors(schoolName);
            });
          //.style("fill", function (d) { return colors(d.population); } ); //this was used to color the points in the scatter plot

    createLegend(data, g, show_uc, show_csu);
  })
}

function createLegend(data, g, show_uc, show_csu){

  var border = g.append("rect")
      .attr("x", 770)
      .attr("y", 450)
      .attr("width", 110)
      .attr("height", 25)
      .style("fill", "white")
      .style("stroke", "black");

  var uc_box = g.append("rect")
      .attr("x", 780)
      .attr("y", 455)
      .attr("width", 15)
      .attr("height", 15)
      .attr("class", "uc_circle")
      .attr("opacity", function () { 
        if(show_uc){
          return 1.0; 
        }
        else{
          return 0.2
        }
      })
      .on("click", function() {
        showScatterPlot(!show_uc, show_csu);
      });

  var uc_text = g.append("text")
      .attr("x", 800)
      .attr("y", 466)
      .attr("font-size", "16px")
      .text("UC");

  var csu_box = g.append("rect")
      .attr("x", 830)
      .attr("y", 455)
      .attr("width", 15)
      .attr("height", 15)
      .attr("class", "csu_circle")
      .attr("opacity", function () { 
        if(show_csu){
          return 1.0; 
        }
        else{
          return 0.2
        }
      })
      .on("click", function() {
        showScatterPlot(show_uc, !show_csu);
      });

  var csu_text = g.append("text")
      .attr("x", 850)
      .attr("y", 466)
      .attr("font-size", "16px")
      .text("CSU");
}

function filterSchools(show_uc, show_csu){

  var scatter_data = d3.json("uc_data.json", function(error, data){
    console.log(data);

    var filteredSchools = data.filter(function(d) { 
      if(d.name.search("UC ") != -1){
        return show_uc;
      }
      else{
        return show_csu;
      }
    });
    return filteredSchools;
  })
}

function showBubbleMajors(schoolName){
  var diameter = 960,
    format = d3.format(",d"),
    color = d3.scaleOrdinal(d3.schemeCategory20c);

  var bubble = d3.pack()
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3.select('#overview_scatter_chart').append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  d3.json("flare.json", function(error, data) {
    if (error) throw error;

    var filteredSchools = data.filter(function(d) { 
      if(d.name.search("UC ") != -1){
        return show_uc;
      }
      else{
        return show_csu;
      }
    });
    data = filteredSchools;

    var root = d3.hierarchy(classes(data))
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    bubble(root);
    var node = svg.selectAll(".node")
        .data(root.children)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.data.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { 
          return color(d.data.packageName); 
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.className.substring(0, d.r / 3); });
  });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: name, className: node.name, value: node.size});
    }

    recurse(null, root);
  return {children: classes};
}

  d3.select(self.frameElement).style("height", diameter + "px");
}