'use strict';
'require baseclass';
'require ui';

function Menu(data, rootElement) {
	this.data = data;
	this.rootElement = document.getElementById(rootElement);
	this.id = "menu-" + Menu.generateId();
}

Menu.prototype.render = function() {
	var node = document.createElement("div");
	var overlay = document.createElement("div");

	node.setAttribute("class", "menu");
	node.dataset.menuId = this.id;
	node.appendChild(new MenuNode({ children: this.data.children, isActive: true }).renderChildren());

	overlay.setAttribute("class", "menu-overlay");

	this.rootElement.appendChild(overlay);
	this.rootElement.appendChild(node);

	document.querySelectorAll("[data-menu-id='" + this.id + "'] .menu-container > .menu-label-wrapper").forEach(function(label) {
		label.addEventListener("click", Menu.toggle);
	});
};

Menu.generateId = function() {
	return Math.round(Math.random() * Math.pow(10, 10));
};

Menu.toggle = function(e) {
	Menu.toggleClass(e.currentTarget.parentNode.querySelector("ul"), "expanded");
	Menu.toggleClass(e.currentTarget.parentNode, "open");
};

Menu.toggleClass = function(node, className) {
	var currentClasses = (node.getAttribute("class") || '').split(" ");
	var classIndex = currentClasses.indexOf(className);
	var newClasses = [];

	if (classIndex < 0) {
		newClasses = currentClasses;
		newClasses.push(className);
	} else {
		newClasses = currentClasses.filter(function(cls) {return cls !== className});
	}

	node.setAttribute("class", newClasses.join(" ").trim());
};

function MenuNode(data) {
	this.data = data;
}

MenuNode.prototype.render = function() {
	var li = document.createElement("li");
	var liClasses = [];
	var labelWrapper = document.createElement("span");
	var text = null;
	var icon = document.createElement("span");
	var labelClasses = ["menu-label"];

	labelWrapper.setAttribute("class", "menu-label-wrapper");

	if (this.data.children && this.data.children.length) {
		icon.setAttribute("class", "icon");
	} else {
		icon.setAttribute("class", "icon placeholder");
	}

	if (this.data.url) {
		text = document.createElement("a");
		text.setAttribute("href", L.url(this.data.url));
	} else {
		text = document.createElement("span");
	}

	labelWrapper.appendChild(icon);
	labelWrapper.appendChild(text);
	li.appendChild(labelWrapper);

	if (this.data.children && this.data.children.length) {
		liClasses.push("menu-container");
		li.appendChild(this.renderChildren());

		if (this.data.isActive) {
			var hasChildActive = false;

			liClasses.push("open");

			for (let i = 0; i < this.data.children.length; i++) {
				if (this.data.children[i].isActive) {
					hasChildActive = true;
					break;
				}
			}

			if (!hasChildActive) {
				labelClasses.push("active");
			}
		}
	} else if (this.data.isActive) {
		labelClasses.push("active");
	}

	text.setAttribute("class", labelClasses.join(" "));
	text.innerText = _(this.data.title);

	if (liClasses.length > 0) {
		li.setAttribute("class", liClasses.join(" "));
	}

	return li;
};

MenuNode.prototype.renderChildren = function() {
	var ul = document.createElement("ul");
	var ulClasses = [];

	if (this.data.isActive) {
		ulClasses.push("expanded");
	}

	if (ulClasses.length > 0) {
		ul.setAttribute("class", ulClasses.join(" "));
	}

	this.data.children.forEach(function(child) {
		ul.appendChild(new MenuNode(child).render());
	});

	return ul;
};

return baseclass.extend({
	__init__: function() {
		ui.menu.load().then(L.bind(this.render, this));
	},

	renderBreadcrumbs: function(breadcrumbs) {
		var e = document.querySelector('#menu-breadcrumbs');

		if (breadcrumbs.length < 2)
			return;

		var ul = E('ul', { class: 'breadcrumbs' });

		for (let i = 1; i < breadcrumbs.length; i++) {
			let url = false;

			if ((i < (breadcrumbs.length - 1)) && breadcrumbs[i].url)
				url = true;

			ul.appendChild(E('li', { class: 'breadcrumbs-item' },
				url ? E('a', { href: L.url(breadcrumbs[i].url) }, _(breadcrumbs[i].title))
				    : _(breadcrumbs[i].title)
			));
		}

		e.appendChild(ul);
	},

	renderMenu: function(menu) {
		new Menu(menu, "sidemenu").render();
	},

	render: function(tree) {
		var breadcrumbs = [];

		var activeNode = tree;
		for (var i = 0; i < L.env.dispatchpath.length; i++) {
			if (!activeNode.children ||
			    !activeNode.children.hasOwnProperty(L.env.dispatchpath[i]))
				break;

			activeNode = activeNode.children[L.env.dispatchpath[i]];
			activeNode.isActive = true;

			if (activeNode.title)
				breadcrumbs.push(activeNode);
		}

		if (!i)
			return;

		var menu = this.convertMenu(tree, '', 0);

		this.renderMenu(menu.children[0]);
		this.renderBreadcrumbs(breadcrumbs);

		var sidemenuToggle = document.getElementById("sidemenu-toggle");
		var sidemenu = document.getElementById("sidemenu");
		var menuOverlay = document.getElementsByClassName("menu-overlay")[0];

		sidemenuToggle.addEventListener("click", function() {
			Menu.toggleClass(sidemenu, "dn");
			Menu.toggleClass(document.body, "menu-opened");
		});

		if (menuOverlay) {
			menuOverlay.addEventListener("click", function() {
				sidemenuToggle.click();
			});
		}
	},

	getChildren: function(node) {
		var children = [];
		for (var k in node.children) {
			if (!node.children.hasOwnProperty(k))
				continue;
			if (!node.children[k].satisfied)
				continue;
			if (!node.children[k].hasOwnProperty('title'))
				continue;
			children.push(Object.assign(node.children[k], { name: k }));
		}
		return children.sort(function(a, b) {
			return ((a.order || 1000) - (b.order || 1000));
		});
	},

	convertMenu: function(node, url, depth) {
		node.children = this.getChildren(node);

		if (node.name)
			if (url && url !== '')
				node.url = url + '/' + node.name;
			else
				node.url = node.name;
		else
			node.url = url;

		for (let i = 0; i < node.children.length; i++) {
			node.children[i] = this.convertMenu(node.children[i], node.url, depth + 1);
		};

		if (!node.action ||
		     node.action.recurse ||
		    ((node.action.type == 'alias') && (node.children.length > 0)) ||
		    (node.action.type == "firstchild"))
			node.url = null;

		return node;
	}
});
