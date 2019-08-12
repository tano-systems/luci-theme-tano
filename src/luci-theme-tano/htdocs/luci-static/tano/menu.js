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
  node.appendChild(new MenuNode({ children: this.data, isActive: true }).renderChildren());

  overlay.setAttribute("class", "menu-overlay");

  this.rootElement.appendChild(overlay);
  this.rootElement.appendChild(node);

  document.querySelectorAll("[data-menu-id='" + this.id + "'] .menu-container > .label-wrapper").forEach(function(label) {
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
  var labelClasses = ["label"];

  labelWrapper.setAttribute("class", "label-wrapper");

  if (this.data.children && this.data.children.length) {
    icon.setAttribute("class", "icon");
  } else {
    icon.setAttribute("class", "icon placeholder");
  }

  if (this.data.url) {
    text = document.createElement("a");
    text.setAttribute("href", this.data.url);
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
  text.innerText = this.data.label;

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

window.addEventListener("load", function() {
  var menuJsonDump = document.getElementById("menu-json");

  if (menuJsonDump) {
    var menuJSON = JSON.parse(menuJsonDump.innerText);
    new Menu(menuJSON, "sidemenu").render();
    var sidemenuToggle = document.getElementById("sidemenu-toggle");
    var sidemenu = document.getElementById("sidemenu");
    var menuOverlay = document.getElementsByClassName("menu-overlay")[0];

    menuJsonDump.remove();

    sidemenuToggle.addEventListener("click", function() {
      Menu.toggleClass(sidemenu, "dn");
      Menu.toggleClass(document.body, "menu-opened");
    });

    if (menuOverlay) {
      menuOverlay.addEventListener("click", function() {
        sidemenuToggle.click();
      });
    }
  }
});
