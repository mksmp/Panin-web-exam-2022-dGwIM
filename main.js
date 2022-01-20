'use strict'

function downloadData() {
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

async function downloadDataById(id) {
    let url = "http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants/" + id + "?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b";
    let jsonData = await ServerRequest(url);
    return jsonData;

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
    let idElement = data_item.id;
    let itemElement = document.createElement('tr');
    itemElement.setAttribute('place-id', idElement);
    itemElement.classList.add('align-middle', 'place-row');
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
    contentElementButton.classList.add('btn', 'btn-outline-secondary', 'choice-btn');
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
        // Создано для того, чтобы создать условие из 4ех параметров, но при этом оно всегда будет пропускать нас к
        // аппенду, осуществляя выборку только по параметрам которые мы выбрали.
        // Это замена 16ти if'ам, чтобы делать выборку по 4ем селектам. 

    }
    console.log(data_sort);
    // Вызовем отюсда пагинацию, так как у нас есть готовый массив с данными
    renderPaginationBtn(data_sort);
}

function renderPrevPaginationBtn() {
    let pagination = document.getElementById('_pagination');
    let btnFirst = document.createElement('button');
    btnLast.classList.add('btn', 'btn-outline-secondary', 'm-2', 'px-4');
    btnFirst.innerHTML = '<';
    pagination.appendChild(btnFirst);
}

function renderNextPaginationBtn() {
    let pagination = document.getElementById('_pagination');
    let btnLast = document.createElement('button');
    btnLast.classList.add('btn', 'btn-outline-secondary', 'm-2', 'px-4');
    btnLast.innerHTML = '>';
    pagination.appendChild(btnLast);
}

function renderPaginationBtn(data) {
    const countBtn = 5; // количество кнопок в пагинации
    const strOnPage = 10; // количество строк в таблице
    const numOfBtn = Math.ceil(data.length / strOnPage) // количество кнопок
    let items = [];
    // renderPrevPaginationBtn()
    for (let i = 1; i <= numOfBtn; i++) {
        let btn = document.createElement('button');
        btn.classList.add('btn', 'btn-outline-secondary', 'm-2');
        btn.innerHTML = i;
        items.push(btn);
    }
    // renderNextPaginationBtn()
    renderFirstlyPagination(items, data);
    setPaginationBtnOnPage(items[0], items, data); // чтобы 1ая страница была сразу активна
    addEventOnButtons(items, data); // вызов генерации пагинации с активными элементами
}

function renderFirstlyPagination(items, data) {
    let pagination = document.getElementById('_pagination');
    const countBtn = 5; // количество кнопок в пагинации
    const strOnPage = 10; // количество строк в таблице
    const numOfBtn = Math.ceil(data.length / strOnPage) // количество кнопок
    // renderPrevPaginationBtn()
    if (numOfBtn <= countBtn) {
        for (let i = 0; i < numOfBtn - 1; i++) {
            pagination.appendChild(items[i]);
        }
    } else {
        for (let i = 0; i < countBtn; i++) {
            pagination.appendChild(items[i]);
        }
        pagination.appendChild(items[numOfBtn - 1]);
        // случай, когда у нас активна одна из первых 4ех кнопок: 1 2 3 4 ... "LastPage" 
    }
}

function dotsOnPagination() {
    let dotsOnPag = document.createElement('p');
    dotsOnPag.innerHTML = '. . .';
    dotsOnPag.classList.add('fw-bold', 'mt-auto', 'mb-0', 'mx-2');
    return dotsOnPag;
} // создание объекта для троеточия в пагинации

function renderLargePagination(b, items, data) {
    let pagination = document.getElementById('_pagination');
    const countBtn = 5;
    const strOnPage = 10; // количество строк в таблице
    const numOfBtn = Math.ceil(data.length / strOnPage) // количество кнопок
    let dotsOnPag1 = dotsOnPagination();
    let dotsOnPag2 = dotsOnPagination();
    let dotsOnPag3 = dotsOnPagination();
    let dotsOnPag4 = dotsOnPagination();
    if (b <= countBtn - 1) {
        pagination.innerHTML = '';
        for (let i = 0; i < countBtn; i++) {
            pagination.appendChild(items[i]);
        }
        pagination.appendChild(dotsOnPag1);
        pagination.appendChild(items[numOfBtn - 1]);
    } // случай, когда у нас активна одна из первых 4ех кнопок: 1 2 3 4 ... "LastPage" 

    else if (b >= numOfBtn - (countBtn - 1) + 1) {
        pagination.innerHTML = '';
        pagination.appendChild(items[0]);
        pagination.appendChild(dotsOnPag2);
        for (let i = numOfBtn - (countBtn - 1) - 1; i < numOfBtn; i++) {
            pagination.appendChild(items[i]);
        }
    } // случай, когда у нас активна одна из последних 4ех кнопок: 1 ... "LastPage" - 3, "LastPage" - 2, "LastPage" - 1, "LastPage" 

    else {
        pagination.innerHTML = '';
        pagination.appendChild(items[0]);
        pagination.appendChild(dotsOnPag3);
        for (let i = -3; i <= 1; i++) {
            pagination.appendChild(items[b + i]);
        }
        pagination.appendChild(dotsOnPag4);
        pagination.appendChild(items[numOfBtn - 1]);

    } // серединные случаи, когда 1 ... btn_x - 1, btn_x, btn_x + 1 ... "LastPage" 

}



function addEventOnButtons(items, data) {
    for (let item of items) {
        item.addEventListener('click', function () {
            setPaginationBtnOnPage(item, items, data)
        })
    }
} // добавим на все кнопки EventListener

let setPaginationBtnOnPage = (function () {
    let active; // переменная, чтобы управлять классом .active
    return function (item, items, data) {


        let table = document.getElementById('table-cafe');

        if (active) { active.classList.remove("active"); } // проверка, что если есть активная кнопка, то убрать у нее класс .active

        active = item; // перезапись переменной для пагинации

        let pageNum = +item.innerHTML; // получение номера страницы, чтобы вычислить данные, которые необходимо отразить

        item.classList.add('active') // сделать текущую кнопку активной

        if (items.length > 5) { renderLargePagination(+item.innerHTML, items, data); } // структурная пагинация с активными элементами

        let start = (pageNum - 1) * 10;
        let end = start + 10;
        let notes = data.slice(start, end); // выделение в массиве данных тех записей, которых нам нужно отобразить на данной странице в таблице

        table.innerHTML = ' '; // обнуление таблицы

        for (let note of notes) {
            table.append(createTableItemElement(note));
        }
        TakeIdOfEatery(); // вытаскиваем id кнопки после выборки по поиску для рендера меню
    };
}()); // function expression, делает для нас нормальную пагинацию

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
} // рендер районов, которые входят в выбранный округ

function EmptyDistrictListItem() {
    let itemElement = document.createElement('option');
    itemElement.innerHTML = "Не выбрано";
    return itemElement;
}

function takePricesFromDataById(data) {
    let arr = [];
    arr.push(data.set_1);
    arr.push(data.set_2);
    arr.push(data.set_3);
    arr.push(data.set_4);
    arr.push(data.set_5);
    arr.push(data.set_6);
    arr.push(data.set_7);
    arr.push(data.set_8);
    arr.push(data.set_9);
    arr.push(data.set_10);
    return arr;
} // берет из данных по id только цены

function renderMenu(prices) {
    const countCards = 10;
    // let menuData = JSON.parse();
    let menuWindow = document.getElementById('menu-of-eaten');
    menuWindow.innerHTML = '';
    for (let i = 0; i < countCards; i++) {
        let card = document.querySelector('.template-card').cloneNode(true);
        card.classList.remove('d-none');
        // card.querySelector('.card-title').innerHTML = menuData[i][1];
        // card.querySelector('.card-text').innerHTML = menuData[i][2];
        card.querySelector('.card-cost').innerHTML = prices[i] + ' P';
        menuWindow.appendChild(card);
    }
}

function clickHandlerChoiceBtn(event) {
    let placeRow = event.target.closest('.place-row'); // берем родительский элемент
    let rowId = placeRow.getAttribute('place-id'); // берем id из нашего атрибута
    downloadDataById(rowId) // загружаем данные по id
        .then(menuItem => takePricesFromDataById(menuItem)) // берем только 10 цен
        .then(arr => renderMenu(arr)); // вызов рендера меню

}

function clickHandlerSearchBtn() {
    downloadForm()
        .then(downloadData => sort(downloadData))
        .then(data => getSelect(data));
} // обработчик кнопки "Найти", которая рендерит таблицу

window.onload = function () {
    downloadData(); // загрузка данных с сервера для отображения списка районов, округов, типов заведений
    downloadForm() // загрузка данных с сервера для добавления в таблицу
        .then(downloadData => sort(downloadData)) // сортировка данных
        .then(data => renderTable(data)) // рендер таблицы
        .then(() => TakeIdOfEatery()); // вытаскиваем id после рендера первоначальной таблицы
    let searchBtn = document.querySelector('.search-btn'); // поиск по кнопке 
    searchBtn.addEventListener('click', clickHandlerSearchBtn);
    // .then(() => TakeIdOfEatery()); // поиск по кнопке 
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


}

function TakeIdOfEatery() {
    for (let btn of document.querySelectorAll('.place-row')) {
        btn.onclick = clickHandlerChoiceBtn;
    }
}