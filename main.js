'use strict'

function downloadData(page = 1) {
    let url = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
        renderAdmAreaList(this.response); // подгрузка округов
        renderDistrictList(this.response); // подгрузка районов
        renderTypeList(this.response); // подгрузка типов заведений
    }
    xhr.send();
} // загрузка данных с сервера для отображения списка районов, округов, типов заведений

function renderAdmAreaList(records) {
    let admAreaList = document.getElementById("adm-area");
    let arrAdmArea = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrAdmArea.length; i++) {
            if (record.admArea != arrAdmArea[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            admAreaList.append(createListItemAdmArea(record));
            flag = 0;
            arrAdmArea.push(record.admArea);
        }
    }
}

function createListItemAdmArea(record) {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = record.admArea;
    return itemElement;
} // запись в select для округа

function renderDistrictList(records) {
    let districtList = document.getElementById("district");
    let arrDistrict = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrDistrict.length; i++) {
            if (record.district != arrDistrict[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            districtList.append(createListItemDistrict(record));
            flag = 0;
            arrDistrict.push(record.district);
        }
    }
}

function createListItemDistrict(record) {
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
        if (i == 10) break
        else {
            table.append(createTableItemElement(data_item));
            i++;
        }
    }
    renderPaginationBtn(data)
} // рендер первоначальной таблицы на 10 строк

function createTableItemElement(data_item) {
    let itemElement = document.createElement('tr');
    itemElement.classList.add('align-middle');
    itemElement.append(createRowName(data_item)); // генерация названия заведения
    itemElement.append(createRowType(data_item)); // генерация типа заведения
    itemElement.append(createRowAddress(data_item)); // генерация адреса заведения
    itemElement.append(createRowButtonTd()); // генерация кнопки для действия
    return itemElement;
} // генерация строки таблицы

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
} // запрос фетч на загрузку данных с сервера

async function downloadForm() {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b';
    let jsonData = await ServerRequest(url);
    return jsonData;
} // загрузка данных с сервера для добавления в таблицу

function sort(jsonData) {
    let data = jsonData.sort(function (a, b) {
        return b.rate - a.rate;
    });
    return data;
}  // Отсортированные заведения по рейтингу, нужно перенести первые 10 в таблицу

function getSelect(data) {
    var arrayFilters = new Map();
    let selectedAdmArea = document.getElementById("adm-area").options.selectedIndex;
    let selectedAdmAreaText = document.getElementById("adm-area").options[selectedAdmArea].text;
    arrayFilters.set('admArea', selectedAdmAreaText);
    let selectedDistrict = document.getElementById("district").options.selectedIndex;
    let selectedDistrictText = document.getElementById("district").options[selectedDistrict].text;
    arrayFilters.set('district', selectedDistrictText);
    let selectedType = document.getElementById("type").options.selectedIndex;
    let selectedTypeText = document.getElementById("type").options[selectedType].text;
    arrayFilters.set('typeObject', selectedTypeText);
    let selectedBenefits = document.getElementById("discount").options.selectedIndex;
    let selectedBenefitsText = document.getElementById("discount").options[selectedBenefits].text;
    arrayFilters.set('socialPrivileges', selectedBenefitsText);
    renderTableSelect(data, arrayFilters);
} // вытаскиваем данные, которые выбрал пользователь

function admAreaListForSelect(records) {
    let arrAdmArea = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrAdmArea.length; i++) {
            if (record.admArea != arrAdmArea[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            flag = 0;
            arrAdmArea.push(record.admArea);
        }
    }
    return arrAdmArea;
} // берет все округа для массива, чтобы выполнять поиск по параметрам

function districtListForSelect(records) {
    let arrDistrict = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrDistrict.length; i++) {
            if (record.district != arrDistrict[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true) {
            flag = 0;
            arrDistrict.push(record.district);
        }
    }
    return arrDistrict;
} // берет все районы для массива, чтобы выполнять поиск по параметрам

function typeListForSelect(records) {
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
            flag = 0;
            arrType.push(record.typeObject);
        }
    }
    return arrType;
} // берет все типы заведений для массива, чтобы выполнять поиск по параметрам

function renderTableSelect(data, arrayFilters) {
    let table = document.getElementById('table-cafe');
    document.getElementById('_pagination').innerHTML = ' ';
    table.innerHTML = " ";
    let i = 0;
    let data_sort = [];
    console.log(arrayFilters);
    let arr_admArea = admAreaListForSelect(data);
    let arr_district = districtListForSelect(data);
    let arr_type = typeListForSelect(data);
    let arr_socPriv = ['true', 'false']

    // Следующие 4 условия служат для того, чтобы проводилась нормально выборка элементов по селекту клиента
    // если мы выбрали элемент, то он добавляется в массив и становится одиночным. Если оставили "Не выбрано", то
    // массив остается из всех элементов этого селекта.
    if (arrayFilters.get("admArea") != "Не выбрано") arr_admArea = [arrayFilters.get("admArea")];
    if (arrayFilters.get("district") != "Не выбрано") arr_district = [arrayFilters.get("district")];
    if (arrayFilters.get("typeObject") != "Не выбрано") arr_type = [arrayFilters.get("typeObject")];
    if (arrayFilters.get("socialPrivileges") != "Не выбрано") arr_socPriv = [String(arrayFilters.get("socialPrivileges"))];

    for (let data_item of data) {
        if (arr_admArea.includes(data_item.admArea)
            && arr_district.includes(data_item.district)
            && arr_type.includes(data_item.typeObject)
            && arr_socPriv.includes(String(data_item.socialPrivileges))) {
            data_sort.push(data_item);
            // table.append(createTableItemElement(data_item));
            i++;
        } // Проверяется условие: если элемент из data_item содержится в массиве селекта, то мы аппендим.
        // Создано для того, чтобы создать условие из 4ех параметров, но при этом он всегда будет пропускать нас к
        // аппенду, осуществляя выборку только по параметрам которые мы выбрали.
        // Это замена 16ти if'ам, чтобы делать выборку по 4ем селектам. 

    }
    console.log(data_sort);
    // Вызовем отюсда пагинацию, так как у нас есть готовый массив с данными
    renderPaginationBtn(data_sort);
}

function renderFirstPaginationBtn() {
    let pagination = document.getElementById('_pagination');
    let btnFirst = document.createElement('button');
    btnFirst.classList.add('btn');
    btnFirst.classList.add('btn-outline-secondary');
    btnFirst.classList.add('m-2');
    btnFirst.innerHTML = 'Первая страница';
    pagination.appendChild(btnFirst);
}

function renderLastPaginationBtn() {
    let pagination = document.getElementById('_pagination');
    let btnLast = document.createElement('button');
    btnLast.classList.add('btn');
    btnLast.classList.add('btn-outline-secondary');
    btnLast.classList.add('m-2');
    btnLast.innerHTML = 'Последняя страница';
    pagination.appendChild(btnLast);
}

function renderPaginationBtn(data) {
    let pagination = document.getElementById('_pagination');
    let items = [];
    if (Math.ceil(data.length / 10) > 5) {
        renderFirstPaginationBtn()
        for (let i = 1; i <= Math.ceil(data.length / 10); i++) {
            let btn = document.createElement('button');
            btn.classList.add('btn');
            btn.classList.add('btn-outline-secondary');
            btn.classList.add('m-2');
            btn.innerHTML = i;
            pagination.appendChild(btn);
            items.push(btn);
        }
        renderLastPaginationBtn()
    }
    else {
        for (let i = 1; i <= Math.ceil(data.length / 10); i++) {
            let btn = document.createElement('button');
            btn.classList.add('btn');
            btn.classList.add('btn-outline-secondary');
            btn.classList.add('m-2');
            btn.innerHTML = i;
            pagination.appendChild(btn);
            items.push(btn);
        }
    }
    // let start = 2;
    // let end = start + 5;
    // let items_five = items.slice(start, end) // начало того дерьма, когда мы делим по 5 кнопок пагинацию
    addEventOnButtons(items, data);
}

function addEventOnButtons(items, data) {
    let table = document.getElementById('table-cafe');
    for (let item of items) {
        item.addEventListener('click', function () {
            let pageNum = +this.innerHTML;

            let start = (pageNum - 1) * 10;
            let end = start + 10;
            let notes = data.slice(start, end);

            table.innerHTML = ' ';

            for (let note of notes) {
                table.append(createTableItemElement(note));
            }
        })
    }
}

function renderNewDistrictList(records, selectedAdmAreaText) {
    let districtList = document.getElementById("district");
    districtList.innerHTML = "";
    districtList.append(EmptyDistrictListItem());
    let arrDistrict = [0];
    let flag;
    for (let record of records) {
        for (let i = 0; i < arrDistrict.length; i++) {
            if (record.district != arrDistrict[i]) {
                flag = true;
            }
            else {
                flag = false;
                break;
            }
        }
        if (flag == true && selectedAdmAreaText == record.admArea) {
            districtList.append(createListItemDistrict(record));
            flag = 0;
            arrDistrict.push(record.district);
        }
    }
}

function EmptyDistrictListItem() {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = "Не выбрано";
    return itemElement;
}

function clickHandlerSearch() {
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => getSelect(data));;
} // обработчик кнопки "Найти", которая рендерит таблицу

window.onload = function () {
    downloadData(); // загрузка данных с сервера для отображения списка районов, округов, типов заведений
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => renderTable(data)); // загрузка данных с сервера для добавления в таблицу
    let searchbtn = document.querySelector('.search-btn'); // поиск по кнопке 
    searchbtn.addEventListener('click', clickHandlerSearch); // поиск по кнопке 
    //////////////// подгрузка определенных районов при выбранном округе /////////////////////
    document.getElementById('adm-area').onchange = function () {
        let selectedAdmArea = document.getElementById("adm-area").options.selectedIndex;
        let selectedAdmAreaText = document.getElementById("adm-area").options[selectedAdmArea].text;
        if (selectedAdmAreaText != "Не выбрано") downloadForm()
            .then(downloadData => renderNewDistrictList(downloadData, selectedAdmAreaText))
        else downloadForm()
            .then(downloadData => renderDistrictList(downloadData))
        ///////////////////////////////////////////////////////////////////////////////////////////
    }
} // загрузка данных





function renderPaginationElement(data) {
    let btn;
    let paginationContainer = document.getElementById('_pagination');
    paginationContainer.innerHTML = '';
    if (data.length == 0) return;

    btn = createPageBtn(1, ['first-page-btn']);
    btn.innerHTML = 'Первая страница';
    if (info.current_page == 1) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);

    let buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('pages-btns');
    paginationContainer.append(buttonsContainer);

    let start = Math.max(info.current_page - 2, 1);
    let end = Math.min(info.current_page + 2, info.total_pages);
    for (let i = start; i <= end; i++) {
        buttonsContainer.append(createPageBtn(i, i == info.current_page ? ['active'] : []));
    }

    btn = createPageBtn(info.total_pages, ['last-page-btn']);
    btn.innerHTML = 'Последняя страница';
    if (info.current_page == info.total_pages) {
        btn.style.visibility = 'hidden';
    }
    paginationContainer.append(btn);
}

function setPaginationInfo(info) {
    document.querySelector('.total-count').innerHTML = info.total_count;
    let start = info.total_count > 0 ? (info.current_page - 1) * info.per_page + 1 : 0;
    document.querySelector('.current-interval-start').innerHTML = start;
    let end = Math.min(info.total_count, start + info.per_page - 1);
    document.querySelector('.current-interval-end').innerHTML = end;
}

function createPageBtn(page, classes = []) {
    let btn = document.createElement('button');
    classes.push('btn');
    btn.classList.add(...classes);
    btn.dataset.page = page;
    btn.innerHTML = page;
    return btn;
}