const urlParams = new URLSearchParams(location.search);
const folio = urlParams.get('folio');
const pageN = urlParams.get('page');

console.log("*******", folio, pageN);

if (folio == null) {
      //aha, this is the home page
        buildFolioTable();
        stop;
}  else {
      //make the page content visible, and hide the index page.
      const divs = document.querySelectorAll('.container-fluid');
      divs[0].classList.remove('active');
      divs[1].classList.add('active');

      //render content based on the folio number

      document.getElementById('folio').innerText = folio; // change the folioname
      let folio_xml = `xml/${folio}.xml`; // convert the folio name to the xml filename
      console.log(folio_xml);
      documentLoader(folio_xml);
      statsLoader(folio_xml); // calls the function that renders the metadata
    
      loadMiradorViewer(Number(pageN));

      navigationbuttons(folio) // call the function that enables the previous and next buttons

    }

// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
//let tei = document.getElementById('folio');

//let tei_xml = tei.innerHTML; //only exists in the folio html pages, not on the index page. Problem
//let extension = ".xml";
//let folio_xml = tei_xml.concat(extension);
//let page = document.getElementById("page"); Not needed anymore, see above
//let pageN = page.innerHTML;
//let number = Number(pageN);

// Loading the IIIF manifest
function loadMiradorViewer (number) {

  console.log(number)

var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});
}


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader(folio_xml) {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../xsl/Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader(folio_xml) {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("../xsl/Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  //documentLoader();
  //statsLoader();
  
  // problems with select hand function
  // "JavaScript will not correctly select elements with the class name #MWS or #PBS because these are invalid class names."
  // remove prefix? Will this solve anything?

  // Event listener for sel1 change
  // added an extra variable for all text
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  var textContainer = document.getElementById("text");
 
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
  //write an forEach() method that shows all the text written and modified by both hands (in black?). The forEach() method of Array instances executes a provided function once for each array element.

    if (event.target.value == 'both') {
      textContainer.classList.remove("unmarkText");
      PercyArray.forEach((element) => element.classList.remove("markText", "unmarkText"));
      MaryArray.forEach((element) => element.classList.remove("markText", "unmarkText"));

    } else if (event.target.value == 'Mary') {
      //write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
      textContainer.classList.add("unmarkText");
      //remove classes from possible previous selection
      MaryArray.forEach((element) => element.classList.remove("unmarkText")); //Mary markeren
      PercyArray.forEach((element) => element.classList.remove("markText")); // Percy onmarkeren

      // what you need to highlight Mary and unmark Percy
      MaryArray.forEach((element) => element.classList.add("markText")); //Mary markeren
      PercyArray.forEach((element) => element.classList.add("unmarkText")); // Percy onmarkeren

    } else {
      //write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
      textContainer.classList.add("unmarkText");
      //remove classes from possible previous selection
      PercyArray.forEach((element) => element.classList.remove("unmarkText"));
      MaryArray.forEach((element) => element.classList.remove("markText"));

      // what you need to highlight Mary and unmark Percy
      PercyArray.forEach((element) => element.classList.add("markText")); //Percy markeren
      MaryArray.forEach((element) => element.classList.add("unmarkText")); // Mary onmarkeren

    }
  }

// write another function that will toggle the display of the deletions by clicking on a button, and a function that will display the text as reading text (combined into one)

function deletionToggler() {
  // first get all the <del> elements in the document, and all the additions that are put in superscript
  const deletions = document.getElementsByTagName("del");
  const additions = document.querySelectorAll('.supraAdd');
  
  // for loop that iterates over every deletion, checks if it is visible or not and alters its state. If it hides deletions, it should remove the styling from the additions
  for (let i = 0; i < deletions.length; i++) {
    const del = deletions[i];
    if (del.style.display === "none") {
      del.style.display = "inline";
      additions.forEach((item) => item.classList.remove('show-normal'));
    } else {
      del.style.display = "none";
      additions.forEach((item) => item.classList.add('show-normal'));
    }
  }
}

// function to generate a table with the pages in this digital edition, based on the dropdown menu

function buildFolioTable() {
  const folioTable = document.querySelector('.folio-table'); // finds the HTML element with the class .folio-table
  const ddi = document.querySelectorAll('#navbarNavDropdown .dropdown-item'); // retrieves all elements inside the #navbarNavDropdown element that have the class .dropdown-item and puts them in a list

  // iterate over each dropdown item 
  ddi.forEach((item) => {
      let tr = document.createElement('tr'); //create a table row for each item
      tr.innerHTML = `<td><a href="${item.href}">${item.innerText}</a></td>`; //add a link to the row
      folioTable.appendChild(tr); //add the row to the table
  });
}

// function to create previous and next buttons:
function navigationbuttons(folio) {

  // Define the list of pages
  const pages = [
    { name: "21r", link: "index.html?folio=21r&page=44" },
    { name: "21v", link: "index.html?folio=21v&page=45" },
    { name: "22r", link: "index.html?folio=22r&page=46" },
    { name: "22v", link: "index.html?folio=22v&page=47" },
    { name: "23r", link: "index.html?folio=23r&page=47" },
    { name: "23v", link: "index.html?folio=23v&page=49" },
    { name: "24r", link: "index.html?folio=24r&page=49" },
    { name: "24v", link: "index.html?folio=24v&page=51" },
    { name: "25r", link: "index.html?folio=25r&page=52" },
    { name: "25v", link: "index.html?folio=25v&page=53" },
  ];

  // Identify the current page from the URL
  //const currentPage = window.location.pathname.split('/').pop(); // Extracts the last segment from the current URL path (the file name)
  const currentIndex = pages.findIndex(page => page.name === folio); // Iterates over the pages array to find the first element that satisfies the condition, namely that link and the extracted currentpage are the same

  // Determine Previous and Next pages (and make sure there even are previous and next pages)
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  // Get the navigation elements
  const prevLink = document.getElementById("prevLink");
  const nextLink = document.getElementById("nextLink");

  // Update "Previous" link
  if (prevPage) {
    prevLink.href = prevPage.link; // Set the link
    prevLink.classList.remove("disabled"); // Ensure it's clickable
  } else {
    prevLink.href = "#"; // Prevent navigation if no previous page
    prevLink.classList.add("disabled"); // Add a disabled style if needed
  }

  // Update "Next" link
  if (nextPage) {
    nextLink.href = nextPage.link; // Set the link
    nextLink.classList.remove("disabled"); // Ensure it's clickable
  } else {
    nextLink.href = "#"; // Prevent navigation if no next page
    nextLink.classList.add("disabled"); // Add a disabled style if needed
  }
}

