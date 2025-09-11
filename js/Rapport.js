// "Rapport.js" ----- 09.09.2025 ----------

// ----------------------------------
function toggleTagesrapport(button) {
// ----------------------------------
  const tagesrapportAuswahlBereich = document.getElementById("tagesrapportAuswahlBereich");

  let originalText = button.textContent;
  if (originalText.endsWith(hideText)) {
    originalText = originalText.slice(0, -hideText.length);
  }

  if (tagesrapportAuswahlBereich.style.display === "none") {
    tagesrapportAuswahlBereich.style.display = "block";
    button.textContent = originalText + hideText;
    ladeTagesrapportTermine();
  } else {
    tagesrapportAuswahlBereich.style.display = "none";
    button.textContent = originalText;
  }
}

//----------------------------------
function ladeTagesrapportTermine() {
//----------------------------------
  const terminAuswahl = document.getElementById("tagesrapportTerminAuswahl");
  const tagesrapportInfo = document.getElementById("TagesrapportInfo");
  terminAuswahl.innerHTML = "<option value=''>-- Bitte wählen --</option>";

  verfuegbareTermine.forEach((termin, index) => {
    const option = document.createElement("option");
    option.value = termin;
    option.textContent = termin;
    if (index === 0 && termin !== '') {
      option.selected = true;
      if (alleAnmeldeInfosCache[termin] && alleAnmeldeInfosCache[termin].helferAnzahl !== undefined) {
        tagesrapportInfo.textContent = `anwesend: ${alleAnmeldeInfosCache[termin].helferAnzahl} Helfer`;
      } else {
        tagesrapportInfo.textContent = `anwesend: - Helfer`;
      }
    }
    terminAuswahl.appendChild(option);
  });
}

//----------------------------------
function zeigeVorherigenTagesrapportTermin() {
//----------------------------------
  const terminAuswahl = document.getElementById("tagesrapportTerminAuswahl");
  const tagesrapportInfo = document.getElementById("TagesrapportInfo");
  let currentIndex = verfuegbareTermine.indexOf(terminAuswahl.value);

  if (currentIndex > 0) {
    currentIndex--;
    terminAuswahl.value = verfuegbareTermine[currentIndex];
    const ausgewaehlterTermin = terminAuswahl.value;
    if (alleAnmeldeInfosCache[ausgewaehlterTermin] && alleAnmeldeInfosCache[ausgewaehlterTermin].helferAnzahl !== undefined) {
      tagesrapportInfo.textContent = `anwesend: ${alleAnmeldeInfosCache[ausgewaehlterTermin].helferAnzahl} Helfer`;
    } else {
      tagesrapportInfo.textContent = `anwesend: - Helfer`;
    }
  }
}

//----------------------------------
function zeigeNaechstenTagesrapportTermin() {
//----------------------------------
  const terminAuswahl = document.getElementById("tagesrapportTerminAuswahl");
  const tagesrapportInfo = document.getElementById("TagesrapportInfo");
  let currentIndex = verfuegbareTermine.indexOf(terminAuswahl.value);

  if (currentIndex < verfuegbareTermine.length - 1) {
    currentIndex++;
    terminAuswahl.value = verfuegbareTermine[currentIndex];
    const ausgewaehlterTermin = terminAuswahl.value;
    if (alleAnmeldeInfosCache[ausgewaehlterTermin] && alleAnmeldeInfosCache[ausgewaehlterTermin].helferAnzahl !== undefined) {
      tagesrapportInfo.textContent = `anwesend: ${alleAnmeldeInfosCache[ausgewaehlterTermin].helferAnzahl} Helfer`;
    } else {
      tagesrapportInfo.textContent = `anwesend: - Helfer`;
    }
  }
}

// ----------------------------------
function exportTagesrapport2Pdf(button) {
// ----------------------------------
  const terminAuswahl = document.getElementById("tagesrapportTerminAuswahl");
  const ausgewaehlterTermin = terminAuswahl.value;
  const loader = button.nextElementSibling;

  if (!ausgewaehlterTermin) {
    showPopup("Bitte wählen Sie einen Termin für den Tagesrapport aus.");
    return;
  }

  const originalText = button.textContent;
  button.textContent = "Rapport wird erstellt...";
  button.disabled = true;
  if (loader) {
    loader.style.display = "inline-block";
  }

  const infoContainerId = `pdfExportInfo_Tagesrapport`;
  const infoContainer = document.getElementById(infoContainerId);
  if (infoContainer.style.display === 'block') {
    infoContainer.style.display = 'none';
    button.textContent = "PDF Export ►";
    button.disabled = false;
    isPdfExporting = false;
    if (loader) {
      loader.style.display = 'none';
    }
    return;
  }

  apiCall('createTagesrapport', { termin: ausgewaehlterTermin })
    .then(result => {
      button.textContent = originalText;
      button.disabled = false;
      if (loader) {
        loader.style.display = "none";
      }
      infoStatus_Tagesrapport.textContent = "Rapport wurde erstellt für " + ausgewaehlterTermin;
      button.textContent = " ";
      togglePdfExport("Tagesrapport", button);
    })
    .catch(error => {
      button.textContent = originalText;
      button.disabled = false;
      if (loader) {
        loader.style.display = "none";
      }
      console.error("Fehler beim Exportieren des Tagesrapports:", error);
      showPopup("Fehler: " + error.message);
    });
}