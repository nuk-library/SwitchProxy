var TableEditor = {

	createTable : function(rows, cols) {
		var buffer = '<table border="1" width="100%"><tbody>';
		for(i = 0; i < rows; i++) {
			buffer += TableEditor.createRow(cols);
		}
		buffer += '</tbody></table>';
		
		return buffer;
		
	},
	createRow : function(cols) {
		buffer = '';
		buffer += '<tr>';
		for(j = 0; j < cols; j++) {
			buffer += '<td>&nbsp;</td>';
		}
		buffer += '</tr>';
		
		return buffer;
	},
	
	
	findCell : function(node) {
		try {
			do {
				node = node.parentNode;
				
				if(node.nodeName == 'TD') {
					return node;
				}
			}
			while(node != null);
			
			return null;
		}
		catch(e) {
			return null;
		}
		
	},
	
	colCount : function(node) {
		return $(node).parent().children().size();		
	},
	rowCount : function(node) {
		return $(node).parents('tbody').children().size();		
	},	
	
	//----------------------------------------------------------------------
	
	addRow : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;
		
		var lastRow = $(cell).parents('tbody').children(':last');
		lastRow.after(TableEditor.createRow(TableEditor.colCount(cell)))
	},
	addColumn : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;
		
		$(cell).parents('tbody').children().each(function() {
			$(this).children('td:last').after('<td>&nbsp;</td>')
		});

	},
	insertRow : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;

		var currentRow = $(cell).parents('tr')
		currentRow.before(TableEditor.createRow(TableEditor.colCount(cell)))		
	},
	insertColumn : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;

		var cellIdx = -1;
		var cells = $(cell).parent().children();
		for(i = 0; i < cells.size(); i++) {
			if(cells[i] == cell) {
				cellIdx = i;
				break;
			}
		}
		
		$(cell).parents('tbody').children().each(function() {
//			alert('td:gt(' + cellIdx + ')');
			$(this).children('td:eq(' + cellIdx + ')').before('<td>&nbsp;</td>');
		});
	},
	
	removeRow : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;

		 $(cell).parent().remove()
	},
	
	removeColumn : function(node) {
		var cell = TableEditor.findCell(node);
		if(cell == null) return;		
		
		var cellIdx = -1;
		var cells = $(cell).parent().children();
		for(i = 0; i < cells.size(); i++) {
			if(cells[i] == cell) {
				cellIdx = i;
				break;
			}
		}
		
		$(cell).parents('tbody').children().each(function() {
			$(this).children('td:eq(' + cellIdx + ')').remove();
		});		
		
	},
	
	insertPre : function() {
		var x = prompt('code');
		tinyMCE.activeEditor.selection.setContent('<pre>' + x + '</pre>');
	}
	
};

var TableEditorUtil = {
	createTable : function() {
		var rc = parseInt($('#rows')[0].value);
		var cc = parseInt($('#cols')[0].value);
		
		tinyMCE.activeEditor.selection.setContent(TableEditor.createTable(rc,cc));
	},
	getSelectedNode : function() {
		return tinyMCE.activeEditor.dom.doc.getSelection().anchorNode;
	}
}

var extid = document.getElementById('table_editor_init_script').src.split('/')[2];

$('.nav').append(
	'<div style="color:white;"> | Tables' +
	
	'Rows: <input type="text" id="rows" value="2" size="2">' +
	'Cols: <input type="text" id="cols" value="2" size="2">' +
	'<button onclick="TableEditorUtil.createTable()">' +
		'<img src="chrome-extension://' + extid + '/img/table.new.png">' +
	'</button> | ' + 
	'<button onclick="TableEditor.insertRow(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.row.insert.png">' +	
	'</button>' + 
	'<button onclick="TableEditor.addRow(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.row.add.png">' +	
	'</button>' + 
	'<button onclick="TableEditor.insertColumn(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.col.insert.png">' +	
	'</button>' + 
	'<button onclick="TableEditor.addColumn(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.col.add.png">' +	
	'</button>' + 	
	
	'| <button onclick="TableEditor.removeRow(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.row.remove.png">' +	
	'</button>' + 
	'<button onclick="TableEditor.removeColumn(TableEditorUtil.getSelectedNode())">' +
		'<img src="chrome-extension://' + extid + '/img/table.col.remove.png">' +	
	'</button>' +
	' | <button onclick="TableEditor.insertPre()">' +
		'Pre' +	
	'</button>' + 	
	'</div>'
);
