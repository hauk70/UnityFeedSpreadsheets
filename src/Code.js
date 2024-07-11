function onOpen() {
    var ui = SpreadsheetApp.getUi();
    var menu = ui.createMenu('Update feed');
    menu.addItem('Update', 'updateFeed');
    menu.addToUi();
  }
  
  function updateFeed() {
    var sheet = getOrCreateSheet('News'); 
    var rssFeeds = [
      'https://unity.com/ru/releases/editor/lts-releases.xml',
      'https://unity.com/ru/releases/editor/beta-releases.xml',
      'https://unity.com/ru/releases/editor/alpha-releases.xml',
      'https://unity.com/ru/releases/editor/tech-and-preview-releases.xml',
    ];
    
    var newsItems = fetchRSSItems(rssFeeds); 
    
    sheet.clear();

    writeDataToSheet(sheet, newsItems);
  
    createLinksInColumn(sheet, 'Link');
    createLinksInColumn(sheet, 'GUID');
    createLinksInColumn(sheet, 'Release Notes');
  }
  
  function getOrCreateSheet(sheetName) {
    var spreadsheet = getActiveSpreadsheet();
    var sheet = spreadsheet.getSheetByName(sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
    }
    return sheet;
  }
  
  function fetchRSSItems(rssFeeds) {
    var newsItems = [];
    var oldCount = 0;
    rssFeeds.forEach(function(url) {
      try {
        Logger.log(`Fetch ${url}`);
        
        oldCount = newsItems.length;

        var response = UrlFetchApp.fetch(url);
        var xml = response.getContentText();
        var document = XmlService.parse(xml);
        var root = document.getRootElement();
        var channel = root.getChild('channel');
    
        if (channel) {
          var items = channel.getChildren('item');
          items.forEach(function(item) {
            var title = item.getChildText('title');
            var link = item.getChildText('link');
            var description = item.getChildText('description');
            var guid = item.getChildText('guid');
            var publishingDate = item.getChildText('pubDate');
            var releaseNotesLink = item.getChildText('releaseNotesLink');
    
            newsItems.push({
                'Title': title,
                'Description': description,
                'Link': link,
                'GUID': guid,
                'Publishing Date': publishingDate,
                'Release Notes': releaseNotesLink,
              });
          });
        }

        Logger.log(`Fetched new ${newsItems.length - oldCount} items`);

      } catch(e) {
        Logger.log(`While fetching ${url} got error ${e}`);
        SpreadsheetApp.getUi().alert(e);
      }
    });
    return newsItems;
  }
  
  function writeDataToSheet(sheet, newsItems) {    
    var headers = ['Title', 'Description', 'Link', 'GUID', 'Release Notes', 'Publishing Date'];
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setValues([headers])
      .setFontWeight('bold')
      .setFontSize(14) 
      .setBackground('#4285F4') 
      .setFontColor('#ffffff')
      .setBorder(true, true, true, true, true, true);
  
    sheet.setColumnWidth(1, 200);
    sheet.setColumnWidth(2, 350);
    sheet.setColumnWidth(3, 80); 
    sheet.setColumnWidth(4, 80); 
    sheet.setColumnWidth(5, 150); 
    sheet.setColumnWidth(6, 160); 
  
    if (newsItems.length === 0) {
        return;
    }

    var data = newsItems.map(function(item) {
        return [
          item['Title'],
          item['Description'],
          item['Link'],
          item['GUID'],
          item['Release Notes'],
          new Date(item['Publishing Date']),
        ];
      });
  
    var dataRange = sheet.getRange(2, 1, data.length, data[0].length);
    dataRange.setValues(data)
        .setFontSize(12)
        .setBorder(true, true, true, true, true, true);

    var dateColumn = sheet.getRange(2, 6, data.length, 1);
    dateColumn.setNumberFormat('dd.MM.yyyy HH:mm:ss');
  }
  
  function createLinksInColumn(sheet, columnName) {
    var dataRange = sheet.getDataRange();
    var numRows = dataRange.getNumRows();
    var values = dataRange.getValues();
    var headerRow = values[0];
  
    var colIndex = headerRow.indexOf(columnName);
    if (colIndex !== -1) {
      for (var i = 1; i < numRows; i++) {
        var cell = sheet.getRange(i + 1, colIndex + 1);
        var url = cell.getValue();
        if (url) {
          var richTextValue = SpreadsheetApp.newRichTextValue()
            .setText(columnName)
            .setLinkUrl(url)
            .build();
          cell.setRichTextValue(richTextValue);
        }
      }
    }
  }
  