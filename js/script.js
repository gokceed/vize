$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/anamenu-snippet.html";
var allCategoriesUrl ="jsons/personel.json";
var categoriesTitleHtml ="snippets/personeltitle.html";
var categoryHtml = "snippets/personelsnippet.html";
var menuItemsTitleHtml ="snippets/workertitle.html";
var menuItemHtml = "snippets/worker.html";
var egitimjson="jsons/egitim.json";
var sınıftitle="snippets/sınıftitle.html";
var sınıf="snippets/sınıf.html";
var lisanssınıftitle="snippets/lisanssınıftitle.html";
var lisanssınıf="snippets/lisanssınıf.html";
var donemtitle="snippets/donemtitle.html";
var donem="snippets/donem.html";
var programtitle="snippets/programtitle.html";
var program="snippets/program.html";
// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  // Remove 'active' from home button
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  // Add 'active' to menu button if not already there
  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  allCategoriesUrl,
  buildAndShowHomeHTML, // ***** <---- TODO: STEP 1: Substitute [...] ******
  true); // Explicitely setting the flag to get JSON from server processed into an object literal
});


// *** finish **

// Builds HTML for the home page based on categories array
// returned from the server.
function buildAndShowHomeHTML (categories) {

  // Load home snippet page
  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtml) {
       var chosenCategoryShortName = chooseRandomCategory(categories).short_name;
      // var homeHtmlToInsertIntoMainPage = ....
      var homeHtmlToInsertIntoMainPage = insertProperty(homeHtml, 'randomCategoryShortName' ,"'" + chosenCategoryShortName + "'"); 
      insertHtml("#main-content", homeHtmlToInsertIntoMainPage);

    },
    false); // False here because we are getting just regular HTML from the server, so no need to process JSON.
}


// Given array of category objects, returns a random category object.

function chooseRandomCategory (categories) {
  // Choose a random index into the array (from 0 inclusively until array length (exclusively))
  var randomArrayIndex = Math.floor(Math.random() * categories.length);

  // return category object with that randomArrayIndex
  return categories[randomArrayIndex];
}

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};
dc.loadegitim = function(){
   showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    egitimjson,
    buildAndShowsınıfilkHTML);
}
dc.loadkacıncı = function(cname){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    egitimjson,
    function(egitimjson){

        if(egitimjson[0].sınıf===cname)
        {
          buildAndShowkacıncıilkHTML(egitimjson[0]);
        }else{
          buildAndShowdonemilkHTML(egitimjson[1])

        }

       
    }
    );
}
dc.loaddonem = function(cname){
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    egitimjson,
    function(egitimjson){

       for(var i=0;i<egitimjson[0].sinifno.length;i++){
        if(egitimjson[0].sinifno[i].id==cname)
        {
          buildAndShowdonemilkHTML(egitimjson[0].sinifno[i]);
        }}

       
    }
    );
}
dc.loadprogram = function(cname){
  
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    egitimjson,
    function(egitimjson){

      
          buildAndShowprogramilkHTML(egitimjson[0].sinifno[0].donem[0].ders);

      

       
    }
    );
}

// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (cname) {

  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    function(allCategoriesUrl){

       for(var i=0;i<allCategoriesUrl.length;i++){
        if(allCategoriesUrl[i].short_name===cname)
        {
          buildAndShowMenuItemsHTML(allCategoriesUrl[i]);
        }

       }
    }
    );
  
};

// Builds HTML for the categories page based on the data
// from the server
function buildAndShowCategoriesHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function buildCategoriesViewHtml(categories,
                                 categoriesTitleHtml,
                                 categoryHtml) {

  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < categories.length; i++) {
    // Insert category values
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}
function buildAndShowsınıfilkHTML (categories) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    sınıftitle,
    function (sınıftitle) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        sınıf,
        function (sınıf) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildAndShowsınıfHTML(categories,
                                    sınıftitle,
                                    sınıf);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}
 function buildAndShowdonemilkHTML(categories){
   $ajaxUtils.sendGetRequest(
    donemtitle,
    function (donemtitle) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        donem,
        function (donem) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildAndShowdonemHTML(categories,
                                    donemtitle,
                                    donem);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);

 }
 function buildAndShowprogramilkHTML(categories){
  console.log(categories);
   $ajaxUtils.sendGetRequest(
    programtitle,
    function (programtitle) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        program,
        function (program) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildAndShowprogramHTML(categories,
                                    programtitle,
                                    program);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
 }
 function buildAndShowprogramHTML(egitimjson,sınıftitlehtml,sınıfhtml)
  {
    
     var finalHtml=sınıftitlehtml;
  finalHtml += "<section class='row'>";
   for (var i = 0; i < egitimjson.length; i++) {
    
    for (var i = 0; i < egitimjson.length; i++) {
    var sınıf =egitimjson[i].x;
  var html=sınıfhtml;
     html =
      insertProperty(html, "saat", sınıf[i]);
      html =
      insertProperty(html, "pazartesi", sınıf[1]);
      html =
      insertProperty(html, "salı", sınıf[2]);
      html =
      insertProperty(html, "carsamba", sınıf[3]);
      html =
      insertProperty(html, "persembe", sınıf[4]);
      html =
      insertProperty(html, "cuma", sınıf[5]);
      finalHtml += html;
    }
    
   }
   finalHtml += "</section>";
  return finalHtml;


  }
 function buildAndShowdonemHTML(egitimjson,sınıftitlehtml,sınıfhtml)
  {
     var finalHtml=sınıftitlehtml;
  finalHtml += "<section class='row'>";
   for (var i = 0; i < egitimjson.donem.length; i++) {
    var html=sınıfhtml;
    var sınıf =egitimjson.donem[i].ad;
     html =
      insertProperty(html, "x", sınıf);
      finalHtml += html;
   }
   finalHtml += "</section>";
  return finalHtml;


  }

function buildAndShowkacıncıilkHTML(categories){
$ajaxUtils.sendGetRequest(
    lisanssınıftitle,
    function (lisanssınıftitle) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        lisanssınıf,
        function (lisanssınıf) {
          // Switch CSS class active to menu button
          switchMenuToActive();

          var categoriesViewHtml =
            buildAndShowkacıncıHTML(categories,
                                    lisanssınıftitle,
                                    lisanssınıf);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

function buildAndShowkacıncıHTML(egitimjson,sınıftitlehtml,sınıfhtml)
  {
     var finalHtml=sınıftitlehtml;
  finalHtml += "<section class='row'>";
   for (var i = 0; i < egitimjson.sinifno.length; i++) {
    var html=sınıfhtml;
    var sınıf =egitimjson.sinifno[i].id;
     html =
      insertProperty(html, "x", sınıf);
      finalHtml += html;
   }
   finalHtml += "</section>";
  return finalHtml;


  }

function buildAndShowsınıfHTML(egitimjson,sınıftitlehtml,sınıfhtml){
  var finalHtml=sınıftitlehtml;
  finalHtml += "<section class='row'>";
   for (var i = 0; i < egitimjson.length; i++) {
    var html=sınıfhtml;
    var sınıf =egitimjson[i].sınıf;
     html =
      insertProperty(html, "sınıf", sınıf);
      finalHtml += html;
   }
   finalHtml += "</section>";
  return finalHtml;

}



function buildAndShowMenuItemsHTML (categoryMenuItems) {
  // Load title snippet of menu items page
  console.log(categoryMenuItems);
 console.log(categoryMenuItems);
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          // Switch CSS class active to menu button
           switchMenuToActive();
           
      
    
    // Insert menu item values
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);

}


// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function buildMenuItemsViewHtml(categoryMenuItems,
                                menuItemsTitleHtml,
                                menuItemHtml) { 

    

  menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "name",
                   categoryMenuItems.name);
  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over menu items
  
  var menuItems = categoryMenuItems.worker;
 
  for (var i = 0; i < menuItems.length; i++) {
    // Insert menu item values
    var html = menuItemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name);
    html =
      insertProperty(html,
                      "lisans",
                      menuItems[i].lisans);
    html =
      insertProperty(html,
                            "eposta",
                            menuItems[i].eposta);
    html =
      insertProperty(html,
                      "telefon",
                      menuItems[i].telefon);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);
  

    // Add clearfix after every second menu item
    if (i % 2 !== 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  } 
   finalHtml += "</section>";
  return finalHtml;

}



global.$dc = dc;

})(window);
