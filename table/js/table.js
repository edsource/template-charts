var prettyTables = {	
	searchTool: function(c){
		var jQueryrows = jQuery(c + ' tr');
		var allRows = jQuery(c + ' tr:not('+ c +' thead tr)');
		console.log(c)

		/* SEARCH STRING
		======================================*/    
		var val = jQuery.trim(jQuery('#pretty-table-search').val()).replace(/ +/g, ' ').toLowerCase();
	    if (val === ''){
	        jQuery(allRows).css('display','table-row');
	    }
	    else if (val !== '') {
	         for (var i=0 ; i < allRows.length ; i++){
	            allRows[i].style.display = "table-row";

	            var testText = allRows[i].textContent;
	            testText = testText.replace(/\s+/g, ' ').toLowerCase();
	            if (testText.indexOf(val) == -1){
	                allRows[i].style.display = "none";
	            }
	         }
	    }	    
	},
	commaSeparateNumber:function(val){
	    while (/(\d+)(\d{3})/.test(val.toString())){
	      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
	    }
	    return val;
	},
	getAttr: function(path, contain, sort, search, title, subhed, source, rowName, format){
		/* DATA PLZ */
		var p = {
			data:[],
			rows:null,
			columns:null,
			contain:null,
			path:null,
			sort:[0,0],
			title:null,
			subhed:null,
			source:null,
			search:false,
			rowName:null,
			format:null
		}
		
		p.path = path;
		d3.text(path, function(error, data){
			if (error) throw error;

			p.data = d3.csv.parseRows(data);
			p.rows = p.data.length;
			p.columns = p.data[0].length;

			p.contain = '#' + contain;
			p.sort = sort;
			p.search = search;
			p.title = title;
			p.subhed = subhed;
			p.source = source;
			p.rowName = rowName;
			p.format = format;

			prettyTables.createTable(p);
		});

		
	},
	createTable: function(p){
		var contain, table, td, tr, th;
		var frag = document.createDocumentFragment();
		var frag2 = document.createDocumentFragment();
		var frag3 = document.createDocumentFragment();

		contain = jQuery(p.contain);
		table = document.createElement('table');
		thead = document.createElement('thead');
		tbody = document.createElement('tbody');

		/* ROWS
		---------------------------------*/
		for (var i = 0; i < p.rows; i++){
			tr = document.createElement('tr');
			if (i == 0){
				for (var j = 0 ; j < p.columns; j++){
					th = document.createElement('th');
					
					if (j==0){
						th.appendChild(document.createTextNode(p.rowName));
					}
					else {
						th.appendChild(document.createTextNode(p.data[0][j]));
					}

					frag3.appendChild(th);
				}
				tr.appendChild(frag3);
				thead.appendChild(tr);
			}
			else {
				for (var j = 0 ; j < p.columns; j++){
					td = document.createElement('td');
					if (j==0){
						td.appendChild(document.createTextNode(p.data[i][j]));
					}
					else {
						if (p.format === '%'){
							var item = (parseFloat(p.data[i][j]) * 100) + '%';
							td.appendChild(document.createTextNode(item));
						}
						else if (p.format === '#'){
							var item = prettyTables.commaSeparateNumber(parseInt(p.data[i][j]));
							td.appendChild(document.createTextNode(item));
						}
						else if (p.format === '$'){
							var item = '$' + prettyTables.commaSeparateNumber(parseInt(p.data[i][j]));
							td.appendChild(document.createTextNode(item));
						}
					}
					frag2.appendChild(td);
				}

				/* Append Row */
				tr.appendChild(frag2);
				frag.appendChild(tr);
			}
		}

		/* TABLE
		---------------------------------*/
		table.appendChild(thead);
		tbody.appendChild(frag);
		table.appendChild(tbody);
		contain.append(table);

		/* CONFIGURE TABLESORTER
		======================================*/ 
		jQuery(p.contain + ' table').tablesorter({sortList:[[0,0]]});

		/* SEARCH COMMANDS
		======================================*/    

	   	if (p.search === 'true'){
	   	 	jQuery('#execute-search').on('click', function(){prettyTables.searchTool(p.contain);});
			jQuery('#pretty-table-search').on('keypress', function(e){
			    var key = e.which;
			    if (key == 13){prettyTables.searchTool(p.contain);}
			})

			jQuery('#reset-search').on('click', function(){
			    jQuery('tr').css('display','table-row');
			    jQuery('#pretty-table-search').val('');
			})
	   }
		

	}	
}





    

