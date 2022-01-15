'use strict'

function downloadData(page = 1) {
    let url = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderOkrugList(this.response);
        renderRaionList(this.response);
        renderTypeList(this.response);
    }
    xhr.send();
}

function renderOkrugList(records) {
    let okrugList = document.getElementById("adm-area");
    let arrOkrug = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrOkrug.length; i++) {
            if (record.admArea != arrOkrug[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            okrugList.append(createListItemOkrug(record));
            flag = 0;
            arrOkrug.push(record.admArea);
        }
    }
}

function createListItemOkrug(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.admArea;
    return itemElement;
}

function renderRaionList(records) {
    let raionList = document.getElementById("district");
    let arrRaion = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrRaion.length; i++) {
            if (record.district != arrRaion[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            raionList.append(createListItemRaion(record));
            flag = 0;
            arrRaion.push(record.district);
        }
    }
}

function createListItemRaion(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.district;
    return itemElement;
}

function renderTypeList(records) {
    let typeList = document.getElementById("type");
    let arrType = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrType.length; i++) {
            if (record.typeObject != arrType[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            typeList.append(createListItemType(record));
            flag = 0;
            arrType.push(record.typeObject);
        }
    }
}

function createListItemType(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.typeObject;
    return itemElement;
}

function renderTable(data) {
    let table = document.getElementById('table-cafe');
    let i = 0;
    for (let data_item of data) {
        if (i == 20) break
        else {
            table.append(createTableItemElement(data_item));
            i++;
        }
    }
}

function createTableItemElement(data_item) {
    let itemElement = document.createElement('tr');
    itemElement.classList.add('align-middle');
    itemElement.append(createRowName(data_item));
    itemElement.append(createRowType(data_item));
    itemElement.append(createRowAddress(data_item));
    itemElement.append(createRowButtonTd());
    return itemElement;
}

function createRowName(data_item) {
    let contentElementName = document.createElement('th');
    contentElementName.innerHTML = data_item.name;
    return contentElementName;
}

function createRowType(data_item) {
    let contentElementType = document.createElement('td');
    contentElementType.innerHTML = data_item.typeObject;
    return contentElementType;
}

function createRowAddress(data_item) {
    let contentElementAddress = document.createElement('td');
    contentElementAddress.innerHTML = data_item.address;
    return contentElementAddress;
}

function createRowButtonTd() {
    let itemElement = document.createElement('td');
    itemElement.append(createRowButton());
    return itemElement;
}

function createRowButton() {
    let contentElementButton = document.createElement('button');
    contentElementButton.innerHTML = "Выбрать";
    contentElementButton.classList.add('btn');
    contentElementButton.classList.add('btn-outline-secondary');
    return contentElementButton;
}

async function ServerRequest(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => alert(error.status));
}

async function downloadForm() {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b';
    let jsonData = await ServerRequest(url);
    return jsonData;
}

function sort(jsonData) { 
    let data = jsonData.sort(function (a, b) {
        return b.rate - a.rate;
    });
    // console.log(data);
    return data;
}  // Отсортированные заведения по рейтингу, нужно перенести первые 20 в таблицу

window.onload = function () {
    downloadData();
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => renderTable(data));
}