function DataGrid(options) {
	this.data = options.data;
	this.rootElement = options.rootElement;
	this.pageSize = options.pageSize;
	this.columns = options.columns;
	this.onRender = options.onRender;
	this.totalRows = 0;
	this.totalPages = 1;
	/* currentPage is zero-based */
	this.currentPage = 0;
	if (typeof(this.pageSize) !== "undefined") {
		
		for (var rows in this.data) {
			this.totalRows++;
		}

		this.totalPages = Math.ceil(this.totalRows / this.pageSize);
		
	}
	this.initialDisplay();
}


DataGrid.prototype.sort = function(label) {
	this.data.sort(
		function(a, b) {
			return ((a[label] < b[label]) ? -1 : ((a[label] > b[label]) ? 1 : 0));
		}
	);
	if (typeof(this.onRender) !== "undefined") {
		this.onRender();
	}
};

DataGrid.prototype.reverse = function() {
	this.data.reverse();
	if (typeof(this.onRender) !== "undefined") {
		this.onRender();
	}
};

DataGrid.prototype.drawTable = function() {
	this.destroy();

	var table = document.createElement("table");

	/* caption part */
	if (typeof(this.pageSize) !== "undefined") {

		var caption = document.createElement("caption");

		var previous = document.createElement("nobr");
		if (this.currentPage === 0) {
			previous.setAttribute("previous", "disabled");
		} else {
			previous.setAttribute("previous", "enabled");
		}
		previous.innerHTML = "< Previous";
		previous.addEventListener("click", this.onclick.bind(this));

		var pageNumber = document.createElement("nobr");
		pageNumber.innerHTML = " " + (this.currentPage+1) + " of " + this.totalPages + " ";

		var next = document.createElement("nobr");
		if (this.currentPage === this.totalPages - 1) {
			next.setAttribute("next", "disabled");
		} else {
			next.setAttribute("next", "enabled");
		}
		next.innerHTML = "Next >";
		next.addEventListener("click", this.onclick.bind(this));

		caption.appendChild(previous);
		caption.appendChild(pageNumber);
		caption.appendChild(next);

		table.appendChild(caption);
	}

	/* thead part */
	var thead = document.createElement("thead");
	var tr = document.createElement("tr");
	for (var i in this.columns) {
		var th = document.createElement("th");
		th.innerHTML = this.columns[i]["name"];
		th.setAttribute("align", this.columns[i]["align"]);
		th.setAttribute("width", this.columns[i]["width"]);	
		th.setAttribute("data-name", this.columns[i]["dataName"]);
		th.setAttribute("title", "Sort by " + this.columns[i]["name"]);
		th.addEventListener("click", this.onclick.bind(this));
		tr.appendChild(th);
	}
	thead.appendChild(tr);
	table.appendChild(thead);

	/* tbody part */
	var tbody = document.createElement("tbody");

	if (typeof(this.pageSize) !== "undefined") {
		var currentPageSize = 0;
		if (this.currentPage < this.totalPages - 1) {
			currentPageSize = this.pageSize;
		} else {
			currentPageSize = this.totalRows - (this.totalPages - 1) * this.pageSize;
		}
		for (var line = this.currentPage * this.pageSize; line < this.currentPage * this.pageSize + currentPageSize; line++) {
			var tr = document.createElement("tr");
			for (var i in this.columns) {
				var td = document.createElement("td");
				var label = this.columns[i]["dataName"];
				td.innerHTML = this.data[line][label];
				td.setAttribute("align", this.columns[i]["align"]);
				td.setAttribute("width", this.columns[i]["width"]);
				td.setAttribute("class", label);
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
	} else {
		for (var line in this.data) {
			var tr = document.createElement("tr");
			for (var i in this.columns) {
				var td = document.createElement("td");
				var label = this.columns[i]["dataName"];
				td.innerHTML = this.data[line][label];
				td.setAttribute("align", this.columns[i]["align"]);
				td.setAttribute("width", this.columns[i]["width"]);
				td.setAttribute("class", label);
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
	}

	table.appendChild(tbody);
	
	if (typeof(this.rootElement) !== 'undefined') {
		this.rootElement.appendChild(table);
	}
};

DataGrid.prototype.onclick = function(event) {
	if (typeof(event.target) !== "undefined") {

		if (event.target.hasAttribute("data-name")) {
			var name = event.target.getAttribute("data-name");
			var col = this.rootElement.getElementsByClassName(name);
			if (col[0].className === name + " selected") {
				this.reverse();
				this.drawTable();
			} else {
				this.sort(name);
				this.drawTable();
			}
			col = this.rootElement.getElementsByClassName(name);
			for(i = 0; i < col.length; i++) {
				col[i].className += " selected";
			}
		} else if (event.target.hasAttribute("previous") && event.target.getAttribute("previous") === "enabled") {
			this.currentPage -= 1;
			if (typeof(this.onRender) !== "undefined") {
				this.onRender();
			}
			this.drawTable();
		} else if (event.target.hasAttribute("next") && event.target.getAttribute("next") === "enabled") {
			this.currentPage += 1;
			if (typeof(this.onRender) !== "undefined") {
				this.onRender();
			}
			this.drawTable();
		}
	}
};

DataGrid.prototype.destroy = function() {
	if (typeof(this.rootElement) !== "undefined") {
		this.rootElement.innerHTML = "";
	}
};

DataGrid.prototype.initialDisplay = function() {
	this.sort(this.columns[0].dataName);
	this.drawTable();
	var col = this.rootElement.getElementsByClassName(this.columns[0].dataName);
	for(i = 0; i < col.length; i++) {
		col[i].className += " selected";
	}
};

