/*
Copyright (c) 2015, Clever Anjos (clever@clever.com.br)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
var simplestbarchart = {
	initialize : function(){
		// initializing some stuff
		var files = [],
			path   = Qva.Remote + "?public=only&type=Object&name=Extensions/community/simplestbarchart";
		Qva.LoadCSS(path+"/styles.css");
		if (!window.d3) files.push(path + "/d3.min.js");
		Qv.LoadExtensionScripts(files, this.start);
	},
	start : function (){	
		Qva.AddExtension('community/simplestbarchart', function() {
			var bars = [];
			for(var i=0,k=this.Data.Rows.length;i<k;i++){  // Collecting data
				var row = this.Data.Rows[i];
				bars.push({ 
					label:row[0].text, 
					value:row[1].data
				})
			}
			config = {
				id 		: this.Name.replace('.','_'),
				width 	: this.GetWidth(),
				height 	: this.GetHeight()
			}
			// Create a placemark, where we will render our bars
			this.Element.innerHTML = '<div class="bars" id="'+config.id+'"></div>';
			jQuery(document).ready(function(){ // Draw the bars when QlikView render the above innerHTML 
				simplestbarchart.draw(bars,config);
			})
		});
	},
	draw : function(bars,config) {
		// Setting scales
		var height = config.height -10;
		var y = d3.scale.linear().range([height,0]);
		var x = d3.scale.ordinal().rangeRoundBands([0, config.width], .05);
		// Setting domains
		x.domain(bars.map(function(d) { return d.label; }));
		y.domain([0, d3.max(bars, function(d) { return d.value; })]);
		// create a svg element and a group inside it
		var svg = d3.select('#'+config.id)
					.append("svg")
						.attr("width",  config.width + 'px')
						.attr("height", config.height+ 'px')
						.append("g")
							.attr('class',"bar")
							.attr("transform", "translate(5 5)")
		//Drawing bars
		svg.selectAll('rect')
			.data(bars)
			.enter()
				.append('rect')		
					.attr('x',function(d){ return x(d.label)})
					.attr('y',function(d){ return y(d.value)})
					.attr('height',function(d){ return height - y(d.value)})
					.attr("width", x.rangeBand())
					.append("svg:title").text( function(d, i) {return d.label + ':' + d.value}); // A simple tooltip
	}
}

/**
 * The start call to instantiate and run the Extension
 */
simplestbarchart.initialize();

