/**
 * CONTROL VIAL - SEGURIDAD ATLAS (ZONA CARIBE)
 * Backend Script para Google Apps Script
 */

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Control Vial - Registro Caribe')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var payload = JSON.parse(contents);
    var resultado = procesarFormulario(payload);
    return ContentService.createTextOutput(JSON.stringify({ status: "success", resultado: resultado }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function procesarFormulario(payload) {
  Logger.log("Procesando formulario para: " + payload.nombre + " - " + payload.placa);
  
  // 1. Obtener o crear la hoja de cálculo de registros
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // 2. Obtener o crear carpeta principal en Google Drive
  var folderName = "CONTROL VIAL CARIBE - DOCUMENTOS";
  var folders = DriveApp.getFoldersByName(folderName);
  var parentFolder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);
  
  // 3. Crear subcarpeta individual para el conductor/vehículo (Cédula_Placa)
  var subFolderName = payload.documento + "_" + payload.placa;
  var userFolder = parentFolder.createFolder(subFolderName);
  
  // 4. Guardar cada archivo base64 en la subcarpeta de Google Drive
  var fileUrls = {};
  var documentKeys = [
    "cedula_frente", "cedula_respaldo",
    "licencia_frente", "licencia_respaldo",
    "propiedad_frente", "propiedad_respaldo",
    "soat", "tecno",
    "moto_derecha", "moto_izquierda", "moto_frente", "moto_trasera"
  ];
  
  documentKeys.forEach(function(key) {
    if (payload[key] && payload[key].base64) {
      var fileData = payload[key];
      var bytes = Utilities.base64Decode(fileData.base64);
      var ext = fileData.mimeType === "application/pdf" ? ".pdf" : ".jpg";
      var blob = Utilities.newBlob(bytes, fileData.mimeType, key + "_" + payload.placa + ext);
      var driveFile = userFolder.createFile(blob);
      fileUrls[key] = driveFile.getUrl();
    } else {
      fileUrls[key] = "";
    }
  });
  
  // 5. Registrar la fila en Google Sheets
  var rowData = [
    new Date(),
    payload.nombre,
    payload.documento,
    payload.departamento,
    payload.ciudad,
    payload.placa,
    payload.es_propietario,
    payload.nombre_propietario || "N/A",
    payload.doc_propietario || "N/A",
    payload.tel_propietario || "N/A",
    fileUrls["cedula_frente"],
    fileUrls["cedula_respaldo"],
    fileUrls["licencia_frente"],
    fileUrls["licencia_respaldo"],
    fileUrls["propiedad_frente"],
    fileUrls["propiedad_respaldo"],
    fileUrls["soat"],
    fileUrls["tecno"],
    fileUrls["moto_derecha"],
    fileUrls["moto_izquierda"],
    fileUrls["moto_frente"],
    fileUrls["moto_trasera"],
    userFolder.getUrl()
  ];
  
  sheet.appendRow(rowData);
  
  return {
    mensaje: "Registro guardado correctamente para " + payload.nombre + " (" + payload.placa + ")",
    folderUrl: userFolder.getUrl()
  };
}
