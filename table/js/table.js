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
	getAttr: function(path, contain, sort, search, title, subhed, source, rowName, format, links, truncate){
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
			format:null,
			links:null,
			truncate:null
		}
		
		p.path = path;

		/* GRAB DATA AND SET ATTRS
		=======================================*/
		d3.text(path, function(error, data){
			if (error) throw error;

			/* Data
			---------------------------------*/
			p.data = d3.csv.parseRows(data);
			p.rows = p.data.length;
			p.columns = p.data[0].length;

			/* Sorting Default
			---------------------------------*/
			var s = sort.split(',');
			p.sort[0] = s[0];
			p.sort[1] = s[1];

			/* Attrs
			---------------------------------*/
			p.contain = '#' + contain;
			p.search = search;
			p.title = title;
			p.subhed = subhed;
			p.source = source;
			p.rowName = rowName;
			p.format = format;
			p.links = links;
			p.truncate = truncate;

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

		/* POPULATE DATA
		======================================*/ 
		for (var i = 0; i < p.rows; i++){
			tr = document.createElement('tr');

			/* Header
			---------------------------------*/
			if (i == 0){
				for (var j = 0 ; j < p.columns; j++){
					if (p.links === 'yes' && j == p.columns - 1){break;}

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
			/* Remaining Rows
			---------------------------------*/
			else {			
				for (var j = 0 ; j < p.columns; j++){

					/* Check if links, + means skip last column
					----------------------------------------------*/
					if (p.links === 'yes' && j == p.columns - 1){console.log(p.columns - 1);break;}
					
					/* Build cell */
					td = document.createElement('td');

					/* Column A
					---------------------------------*/
					if (j==0){
						
						/* Add Links to Column A
						---------------------------------*/
						if (p.links === 'yes'){
							var link = document.createElement('a');
							link.setAttribute('href', p.data[i][p.columns - 1]);
							link.innerHTML = p.data[i][0];
							td.appendChild(link);
						}
						/* Default Column A
						---------------------------------*/
						else {td.appendChild(document.createTextNode(p.data[i][j]));}						
					}
					/* Remaining Columns
					---------------------------------*/
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

		/* PUT TABLE TOGETHER
		======================================*/ 
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
		jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-meta').append('<p><em>Source: '+ p.source +'</em></p>');	

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
				if (p.links === 'yes' && j == p.columns - 1){break;}
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-fixed').append('<div>' + p.data[0][j]  + '</div>');
			}
		} 

		/* FIXED HEADER WIDTH
		======================================*/
		if (p.links === 'yes'){var fixedHedWidth = 100 / (p.columns - 1);}
		else {var fixedHedWidth = 100 / p.columns;}

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

		/* TRUNCATION
		======================================*/
		if (p.truncate != null){
			//hide all rows past 10th as default
			jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(10).hide();

			//add navigation buttons
			jQuery('.pretty-table[data="'+ p.contain +'"]').append('<div class="pretty-table-nav"><p first="1"><a>Previous</a></p><p status="0"><a>Expand Rows</a></p><p last="10"><a>Next</a></p></div>');

			// Next Rows
			jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').on('click', function(){
				var last = parseInt(jQuery(this).attr('last')), total = jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').size();

				//show previous
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(0)').css('display', 'inline');
				
				//make sure we don't hide all the rows
				if (total === last){return;}
				else if ((last+10) > total){
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(last, total).show();
					jQuery(this).attr('last', total);
				}
				else {
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(last, last+10).show();
					last += 10;
					jQuery(this).attr('last', last);
				}		

				//do we need a next?
				if (total === last){jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').hide();}	

				//update previous data
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(0)').attr('first', last-9);

			});

			// Expand All or Collapse
			jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(1)').on('click', function(){
				var status = parseInt(jQuery(this).attr('status'));

				if (status == 0){
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').show();
					jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(1) a').text('Collapse Rows');
					jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(0)').attr('first', '1').hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').attr('last', '10').hide();
					jQuery(this).attr('status', '1');
				}
				else if (status == 1){
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(10).hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(1) a').text('Expand Rows');
					jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').css('display', 'inline');
					jQuery(this).attr('status', '0');
				}
				
			});

			// Previous Rows
			jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(0)').on('click', function(){
				var first = parseInt(jQuery(this).attr('first'));

				//show next
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').css('display', 'inline');

				//make sure we don't hide all the rows
				if (first == 1){return;}
				else if ((first-10) < 1){
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(0, 10).show();
					jQuery(this).attr('first', 1);
				}
				else {
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').hide();
					jQuery('.pretty-table[data="'+ p.contain +'"] tbody tr').slice(first-11, first-1).show();
					first -= 10;
					jQuery(this).attr('first', first);
				}		

				//update next data
				jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(2)').attr('last', first+9);

				//do we need a previous?
				if (first === 1){jQuery('.pretty-table[data="'+ p.contain +'"] .pretty-table-nav p:eq(0)').hide();}	

			});
		}	
	},
}




    

