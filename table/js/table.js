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

			console.log(sort)

			var s = sort.split(',');
			p.sort[0] = s[0];
			p.sort[1] = s[1];

			p.contain = '#' + contain;
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
							var item = Math.round(parseFloat(p.data[i][j]) * 100) + '%';
							td.appendChild(document.createTextNode(item));
						}
						else if (p.format === '#'){
							var item = parseInt(p.data[i][j]);
							td.appendChild(document.createTextNode(item));
						}
						else if (p.format === '$'){
							var item = '$' + prettyTables.commaSeparateNumber(parseInt(p.data[i][j]));
							td.appendChild(document.createTextNode(item));
						}
						else if (p.format === 'txt'){
							var item = p.data[i][j];
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
		jQuery(p.contain + ' table').tablesorter({sortList:[[p.sort[0],p.sort[1]]]});

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

	   /* META DATA
		======================================*/ 
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-meta').append('<h2>'+ p.title +'</h2>');	
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-meta').append('<p>'+ p.subhed +'</p>');	
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-meta').append('<p><em>'+ p.source +'</em></p>');	

		/* STYLES
		======================================*/ 	
		var totalRows = jQuery('.pretty-table[data="'+ p.contain +'"] tr').size();

		/* ADD FIXED HEADER
		======================================*/
		jQuery('.pretty-table[data="'+ p.contain +'"]').append('<div class="pretty-table-fixed"></div>');
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').detach().insertBefore(p.contain);

		for (var j = 0 ; j < p.columns; j++){
			if (j==0){
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').append('<div>' + p.rowName + '</div>');
			}
			else {
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').append('<div>' + p.data[0][j]  + '</div>');
			}
		} 

		var fixedHedWidth = 100 / p.columns;
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed div').css('width', fixedHedWidth + '%');

		/* WORK THE FIXED HEADER
		======================================*/
		var realHed = jQuery('.pretty-table[data="'+ p.contain +'"] thead').offset();
		var lastRow = jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr:last-of-type').offset();

		jQuery(document).on('scroll', function(){
			var curPos = jQuery(this).scrollTop();

			var tableWidth = jQuery('.pretty-table[data="'+ p.contain +'"] table').width();
			jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').css('width', tableWidth + 'px');

			if (curPos > realHed.top + 60 && curPos < lastRow.top) {
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').show();
			}
			else {
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').hide();
			}
		});


		
		

	},
}




    

