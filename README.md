# UnityFeedSpreadsheets

Этот проект предназначен для автоматического парсинга RSS фидов с помощью Google Apps Script и отображения данных в Google Sheets.

## Установка

1. Установите [Node.js](https://nodejs.org/) и [npm](https://www.npmjs.com/get-npm).

2. Установите `clasp` (Command Line Apps Script Projects) глобально:
    ```
    npm install -g @google/clasp
    ```

3. Авторизуйтесь в `clasp`:
    ```
    clasp login
    ```

## Создание нового проекта

1. Создайте новый Google Apps Script проект с типом "sheets":
    ```
    clasp create --type sheets --title "My New Project"
    ```

2. После выполнения команды вы увидите что-то похожее на следующее:
    ```
    Created new script: https://script.google.com/d/your-script-id-here/edit
    ```

3. Скопируйте `scriptId` из URL (он находится между `/d/` и `/edit`).

4. Откройте Google Sheets и создайте новую таблицу.

5. Скопируйте ID таблицы из URL (он находится между `/d/` и `/edit`).

## Настройка

1. Склонируйте этот репозиторий на свой локальный компьютер:
    ```
    git clone https://github.com/hauk70/UnityFeedSpreadsheets.git
    cd UnityFeedSpreadsheets
    ```

2. В файле `.clasp.json` замените `YOUR_SCRIPT_ID` на ID вашего приложения и `YOUR_GOOGLE_SPREADSHEETS_ID` на ID вашего контейнера (Google Sheets ID).

    Пример `.clasp.json`:
    ```
    {
        "scriptId": "YOUR_SCRIPT_ID",
        "rootDir": "./src",
        "parentId": [
            "YOUR_GOOGLE_SPREADSHEETS_ID"
        ]
    }
    ```

## Развертывание

1. Синхронизируйте локальные файлы с вашим Google Apps Script проектом:
    ```
    clasp push
    ```

2. Откройте ваш проект в Google Apps Script редакторе:
    ```
    clasp open
    ```

## Полезные команды

- `clasp pull`: Скачивает последние изменения из вашего Google Apps Script проекта на локальный компьютер.
- `clasp push`: Загружает локальные изменения в ваш Google Apps Script проект.
- `clasp open`: Открывает проект в Google Apps Script редакторе.

## Дополнительная информация

Более подробную информацию можно найти в официальной документации [clasp](https://developers.google.com/apps-script/guides/clasp).
