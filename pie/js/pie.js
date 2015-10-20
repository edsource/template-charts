var pieChart = {
	getAttr: function(type, path, contain, w, h, m, padding, color, inrad, title, subhed, source, legend){
		var p = {
			label:[],
			data:[],
			w:null,
			h:null,
			m:{},
			contain:null,
			path:null,
			color:null,
			inRad:null,
			title:null,
			subhed:null,
			source:null,
			type:null,
			legend:null,
			keys:null,
			padding:null
		}

		p.type = type;

		p.w = parseInt(w)
		p.h = parseInt(h)
		p.m = {
			top:m[0],
			right:m[1],
			bottom:m[2],
			left:m[3]
		};
		p.r = Math.min(w, h) / 2;
		p.labelr = p.r + 30;
		p.padding = padding;

		p.path = path;
		p.contain = '#' + contain;
		p.color = color.split(',');
		p.inRad = inrad;
		p.outRad = p.w / 2

		p.title = title;
		p.subhed = subhed;
		p.source = source;
		p.legend = legend;

		d3.csv(path, function(error, data){
			if (error) throw error;

			var keys = Object.keys(data[1]);
			p.keys = keys;
			
			for (var i = 0; i < keys.length; i++) {
			    var x = parseInt(data[0][keys[i]]);
			    var y = data[1][keys[i]];

			    p.data.push(x);
			    p.label.push(y);

			}
			
			pieChart.drawChart(p);

		});
	},
	drawChart: function(p){

		var xAdj, yAdj, y1, y2;
		var arc = d3.svg.arc().innerRadius(p.inRad).outerRadius(p.outRad);
		var pie = d3.layout.pie().sort(null);

		var color = d3.scale.ordinal().range(p.color);

		var svg = d3.select(p.contain).append('svg').attr('width', p.w).attr('height', p.h).classed('pie', true);

		var arcs = 	svg.selectAll("g.arc").data(pie(p.data)).enter().append("g").attr("class", "arc").attr("transform", "translate(" + p.outRad + "," + p.outRad + ")");
					arcs.append("path").attr("fill", function(d, i) {return p.color[i];}).attr("d", arc);
					arcs.append("svg:text").attr("transform", function(d) {
						var c = arc.centroid(d),
				            x = c[0],
				            y = c[1],
				            // pythagorean theorem for hypotenuse
				            h = Math.sqrt(x*x + y*y);
				            xAdj = (x/h * p.labelr);
				            yAdj = (y/h * p.labelr);
				        return "translate(" + xAdj +  ',' + yAdj +  ")"; 
				    }).attr("dy", ".35em").attr("text-anchor", function(d) {return (d.endAngle + d.startAngle)/2 > Math.PI ? 'end' : 'start'}).data(p.label).attr('fill', '#666').text(function(d, i) {return d; });
		

		/* META
		===========================*/
		jQuery('.pie-contain[data="'+ p.contain +'"] .pie-meta h2').text(p.title);
		jQuery('.pie-contain[data="'+ p.contain +'"] .pie-meta p:eq(0)').text(p.subhed);
		jQuery('.pie-contain[data="'+ p.contain +'"] .pie-meta p:eq(1) em').text(p.source);

		/* LEGEND
		===========================*/
		if (p.legend == true || p.legend === 'true'){
			for (var i=0 ; i < p.data.length ; i++){
				jQuery('.pie-contain[data="'+ p.contain +'"] .pie-legend').append('<div><div class="pie-legend-box"></div><p>'+ p.keys[i] +'</p></div>');
				jQuery('.pie-contain[data="'+ p.contain +'"] .pie-legend>div:eq('+i+') .pie-legend-box').css('background', p.color[i]);
			}
		}

		/* STYLE
		===========================*/
		jQuery(p.contain + ' svg').css('padding', p.padding + 'px');
		jQuery('.pie-contain[data="'+ p.contain +'"]').css('width', (p.w + (parseInt(p.padding) * 2)) + 'px');

		//this.adjustLine();
	},
	adjustLine: function(){
		jQuery('.arc:eq(0) line').attr({
			'y1':120,
			'x1':50
		});
		jQuery('.arc:eq(1) line').attr({
			'y1':-90,
			'x1':-100
		});
		jQuery('.arc:eq(2) line').attr({
			'y1':-120,
			'x1':-43
		});
		//30 adjust on all figure out auto later
	}
}

