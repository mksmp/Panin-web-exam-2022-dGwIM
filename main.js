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

async function downloadForm(url) {
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
        for (let i = 0; i < numOfBtn; i++) {
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
    const countBtn = 3;
    const strOnPage = 10; // количество строк в таблице
    const numOfBtn = Math.ceil(data.length / strOnPage) // количество кнопок
    let dotsOnPag1 = dotsOnPagination();
    let dotsOnPag2 = dotsOnPagination();
    let dotsOnPag3 = dotsOnPagination();
    let dotsOnPag4 = dotsOnPagination();
    if (b <= countBtn) {
        pagination.innerHTML = '';
        for (let i = 0; i < countBtn + 1; i++) {
            pagination.appendChild(items[i]);
        }
        pagination.appendChild(dotsOnPag1);
        pagination.appendChild(items[numOfBtn - 1]);
    } // случай, когда у нас активна одна из первых 4ех кнопок: 1 2 3 4 ... "LastPage" 

    else if (b >= numOfBtn - (countBtn - 1) + 1) {
        pagination.innerHTML = '';
        pagination.appendChild(items[0]);
        pagination.appendChild(dotsOnPag2);
        for (let i = numOfBtn - (countBtn - 1) - 2; i < numOfBtn; i++) {
            pagination.appendChild(items[i]);
        }
    } // случай, когда у нас активна одна из последних 4ех кнопок: 1 ... "LastPage" - 3, "LastPage" - 2, "LastPage" - 1, "LastPage" 

    else {
        pagination.innerHTML = '';
        pagination.appendChild(items[0]);
        pagination.appendChild(dotsOnPag3);
        for (let i = -2; i <= 0; i++) {
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

function takeJsonInfo(prices, placeId) {
    let url = './menu.json'
    downloadForm(url)
        .then(jsonData => renderMenu(prices, jsonData, placeId));
}

function renderMenu(prices, jsonData, placeId) {
    let menuWindow = document.getElementById('menu-of-eaten');
    document.querySelector('.header-of-menu').classList.remove('d-none'); // делаем видимым заголовок меню
    menuWindow.classList.remove('d-none'); // делаем видимым меню
    document.querySelector('.options-of-menu').classList.remove('d-none'); // делаем видимым доп функции и стоимость выбранных позиций
    menuWindow.innerHTML = ''; // обнулить меню
    countOfTakePrize = 0; // обнулить счетчик, который показывает выпал ли нам уже в этом заведении подарок
    let k = 0;
    console.log(jsonData);
    for (let data of jsonData) {
        let card = document.querySelector('.template-card').cloneNode(true);
        card.classList.remove('d-none', '.template-card');
        card.classList.add('card-in-menu');
        card.querySelector('.card-img-top').setAttribute('src', data.logo)
        card.querySelector('.card-title').innerHTML = data.name;
        card.querySelector('.card-text').innerHTML = data.desc;
        card.querySelector('.card-cost').innerHTML = prices[k];
        k++;
        menuWindow.appendChild(card);
    } // добавляем карточки в меню
    addCostOfDish(); // clickHandler на увеличение количества блюда
    removeCostOfDish(); // clickHandler на уменьшение количества блюда
    document.querySelector('.btn-order').onclick = function () {
        clickHandlerGoModal(placeId); // навешиваем обработчик на кнопку оформления заказа
    }
}

function cleanModal() {
    let positionsOfOrder = document.querySelector('.positions-of-order'); // родитель всех позиций заказа
    positionsOfOrder.innerHTML = ''; // очистка позиций
    document.querySelector('.modal-final-cost').innerHTML = 0; // обнуление общей суммы
}

function renderPositionsOfModalMenu() {
    let positionsOfOrder = document.querySelector('.positions-of-order'); // родитель всех позиций заказа
    let positionOfMenu = document.querySelectorAll('.card-in-menu'); // взять все карточки из меню
    for (let position of positionOfMenu) {
        if (position.querySelector('.input-value').value != 0) {
            let modalCard = document.querySelector('.template-position-element').cloneNode(true);
            modalCard.classList.remove('d-none', '.template-position-element');
            let img = position.querySelector('.card-img-top').getAttribute('src'); // берем катинку из меню
            modalCard.querySelector('.img-position-element').setAttribute('src', img); // отправляем картинку из меню в модальное окно
            modalCard.querySelector('.text-position-element').innerHTML = position.querySelector('.card-title').innerHTML; // берем название из карточки меню
            modalCard.setAttribute('count-choosen', position.querySelector('.input-value').value); // добавляем новый атрибут, чтобы вынести из него количество одной позиции
            modalCard.querySelector('.price-position-element').innerHTML = position.querySelector('.card-cost').innerHTML + 'x' + position.querySelector('.input-value').value; // подсчет
            modalCard.querySelector('.end-price-position-element').innerHTML = +position.querySelector('.card-cost').innerHTML * +position.querySelector('.input-value').value; // итоговая цена по карточке
            positionsOfOrder.appendChild(modalCard);
        }
    }
} // функция служит для генерации выбранных позиций из меню в модальном окне

function renderPrizeinModalMenu() {
    let positionsOfOrder = document.querySelector('.positions-of-order'); // родитель всех позиций заказа
    let positionOfMenu = document.querySelectorAll('.card-in-menu'); // взять все карточки из меню

    let randPositionOfMenu = getRandomInt(10); // случайное число от 0 до 9

    if (document.getElementById('IWannaGift').checked && countOfTakePrize == 0 && positionOfMenu[randPositionOfMenu].querySelector('.input-value').value == 0) {
        countOfTakePrize++;
        let modalCard = document.querySelector('.template-position-element').cloneNode(true);
        modalCard.classList.remove('d-none', '.template-position-element');
        let img = positionOfMenu[randPositionOfMenu].querySelector('.card-img-top').getAttribute('src'); // берем катинку из меню
        modalCard.querySelector('.img-position-element').setAttribute('src', img); // отправляем картинку из меню в модальное окно
        modalCard.querySelector('.text-position-element').innerHTML = positionOfMenu[randPositionOfMenu].querySelector('.card-title').innerHTML; // берем название из карточки меню
        modalCard.querySelector('.price-position-element').innerHTML = '-'; // подсчет
        modalCard.querySelector('.end-price-position-element').innerHTML = 0; // итоговая цена по карточке
        positionsOfOrder.appendChild(modalCard);
    } else if (document.getElementById('IWannaGift').checked && countOfTakePrize == 0 && positionOfMenu[randPositionOfMenu].querySelector('.input-value').value > 0) {
        let positions = document.querySelectorAll('.position-element');
        for (let position of positions) {
            if (position.querySelector('.text-position-element').innerHTML == positionOfMenu[randPositionOfMenu].querySelector('.card-title').innerHTML) {
                let temp = position.getAttribute('count-choosen');
                temp = +temp + 1;
                position.querySelector('.price-position-element').innerHTML = positionOfMenu[randPositionOfMenu].querySelector('.card-cost').innerHTML + 'x' + temp; // подсчет
            }
        }
    }
} // функция служит для рандомизации подарка. Если у нас выпадает позиция, которая была еще не выбрана, то она просто добавляется в модальное окно с нулевой стоимостью.
// Если у нас выпадает подарок, который мы уже выбирали как позицию из меню, то мы берем значение атрибута, по которому мы понимаем количество по данной позиции,
// а далее проходимся по всем позициям в модальном окне: если мы нашли сопадение имени подарка и имени позиции, то мы увеличиваем количество по данной позиции.

let countOfTakePrize = 0; // мы ввели переменную для того, чтобы проверять выбралась ли случайная позиция из меню данного ресторана

function clickHandlerGoModal(placeId) {
    cleanModal(); // очистка значений в модальном окне
    checkOfCheckbox(); // проверка на чекбоксы

    renderPositionsOfModalMenu();

    renderPrizeinModalMenu();

    downloadDataById(placeId)
        .then(data => renderInfoAboutPlaceInModal(data)); // рендер информации о заведении в модальном окне

    let allEndPricesInModal = document.querySelectorAll('.end-price-position-element');
    let endPrice = document.querySelector('.modal-final-cost').innerHTML;
    for (let price of allEndPricesInModal) {
        endPrice = +endPrice + +price.innerHTML;
    } // получение конечной стоимости заказа в модальном окне
    if (document.getElementById('FastDelivery').checked) {
        endPrice = endPrice * 1.2;
    } // по условию если выбран чекбокс с быстрой доставкой, то мы увеличиваем стоимость на 20%
    document.querySelector('.modal-final-cost').innerHTML = endPrice + 'P';

    document.querySelector('.btn-repeat-order').onclick = function () {
        takeBackOnChooseAndClean();
    } // если выбрана кнопка отмена заказа, то мы откатываемся в первоначальное положение. Полное пояснение ниже под функцией "takeBackOnChooseAndClean".
}

function takeBackOnChooseAndClean() {
    document.querySelector('.header-of-menu').classList.add('d-none'); // скрываем все меню данного заведения
    document.getElementById('menu-of-eaten').classList.add('d-none'); // скрываем все меню данного заведения
    document.querySelector('.options-of-menu').classList.add('d-none'); // скрываем все меню данного заведения
    document.getElementById('IWannaGift').checked = false; // убираем галочку в чекбоксе о подарке
    document.getElementById('FastDelivery').checked = false; // убираем галочку в чекбоксе о быстрой доставке
} // функция "чистит" наш выбор по данному заведению, если мы отказались брать данный заказ. 
// Данная функция служит для того, чтобы люди не игрались с тем, что можно каждый раз по кнопке генерить разный подарок, тем самым увеличивая шансы выпадения нужной позиции
// Это я добавил от себя, если что можно все вернуть обратно, чтобы ничего не сбрасывалось и подарок генерировался постоянно рандомно при каждом нажатии на конпку "Оформить заказ".

function renderInfoAboutPlaceInModal(jsonData) {
    document.querySelector('.modal-information-name').innerHTML = jsonData.name;
    document.querySelector('.modal-information-adm-area').innerHTML = jsonData.admArea;
    document.querySelector('.modal-information-dist').innerHTML = jsonData.district;
    document.querySelector('.modal-information-address').innerHTML = jsonData.address;
    document.querySelector('.modal-information-rating').innerHTML = jsonData.rate;
} // функция рендерит в модальном окне информацию о заведении

function checkOfCheckbox() {
    if (document.getElementById('IWannaGift').checked) {
        document.querySelector('.free-gift-checkbox').innerHTML = 'Да';
    } else {
        document.querySelector('.free-gift-checkbox').innerHTML = 'Нет';
    }

    if (document.getElementById('FastDelivery').checked) {
        document.querySelector('.fast-delivery-checkbox').innerHTML = '+20%';
    } else {
        document.querySelector('.fast-delivery-checkbox').innerHTML = 'Нет';
    }
} // функция проверяет выбраны ли чекбоксы и вставляет в модальное окно то, что выбрано

function clickHandlerChoiceBtn(event) {
    document.getElementById('final-cost').innerHTML = 0;
    let placeRow = event.target.closest('.place-row'); // берем родительский элемент
    let rowId = placeRow.getAttribute('place-id'); // берем id из нашего атрибута
    downloadDataById(rowId) // загружаем данные по id
        .then(menuItem => takePricesFromDataById(menuItem)) // берем только 10 цен
        .then(arr => takeJsonInfo(arr, rowId)); // вызов рендера меню
}

function clickHandlerSearchBtn() {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b';
    downloadForm(url)
        .then(downloadData => sort(downloadData))
        .then(data => getSelect(data));
} // обработчик кнопки "Найти", которая рендерит таблицу

function TakeIdOfEatery() {
    for (let btn of document.querySelectorAll('.place-row')) {
        btn.onclick = clickHandlerChoiceBtn;
    }
} // навешиваем обработчик событий на кнопки "Выбрать" у каждого заведения, чтобы вытаскивать id-шники и работать дальше с этими заведениями.

function addCostOfDish() {
    for (let btn of document.querySelectorAll('.button-plus')) {
        btn.onclick = clickHandlerAddCostBtn;
    }
} // назначим обработчик на каждую кнопку

function removeCostOfDish() {
    for (let btn of document.querySelectorAll('.button-minus')) {
        btn.onclick = clickHandlerRemoveCostBtn;
    }
} // назначим обработчик на каждую кнопку

function clickHandlerAddCostBtn(event) {
    document.querySelector('.btn-order').removeAttribute('disabled');
    event.target.parentNode.querySelector('.input-value').stepUp();
    let temp = event.target.closest('.card-body');
    let cost = temp.querySelector('.card-cost').innerHTML;

    document.getElementById('final-cost').innerHTML = +document.getElementById('final-cost').innerHTML + +cost;
    console.log(cost);
} // увеличение количества по данной позиции меню

function clickHandlerRemoveCostBtn(event) {
    if (event.target.parentNode.querySelector('.input-value').value != 0) {
        event.target.parentNode.querySelector('.input-value').stepDown();
        let temp = event.target.closest('.card-body');
        let cost = temp.querySelector('.card-cost').innerHTML;
        document.getElementById('final-cost').innerHTML = +document.getElementById('final-cost').innerHTML - +cost;
        console.log(cost);
    }
    if (document.querySelector('#final-cost').innerHTML == 0) {
        document.querySelector('.btn-order').setAttribute('disabled', 'true');
    }
} // уменьшение количества по данной позиции меню

window.onload = function () {
    let url = 'http://exam-2022-1-api.std-900.ist.mospolytech.ru/api/restaurants?api_key=17e65b07-b348-471d-a4b7-94b9b78e091b';
    downloadData(); // загрузка данных с сервера для отображения списка районов, округов, типов заведений
    downloadForm(url) // загрузка данных с сервера для добавления в таблицу
        .then(downloadData => sort(downloadData)) // сортировка данных
        .then(data => renderTable(data)) // рендер таблицы
        .then(() => TakeIdOfEatery()); // вытаскиваем id после рендера первоначальной таблицы
    // .then(() => addCostOfDish)
    // .then(() => removeCostOfDish);
    let searchBtn = document.querySelector('.search-btn'); // поиск по кнопке 
    searchBtn.addEventListener('click', clickHandlerSearchBtn);

    //////////////// подгрузка определенных районов при выбранном округе /////////////////////
    document.getElementById('adm-area').onchange = function () {
        let selectedAdmArea = document.getElementById("adm-area").options.selectedIndex;
        let selectedAdmAreaText = document.getElementById("adm-area").options[selectedAdmArea].text;
        if (selectedAdmAreaText != "Не выбрано") downloadForm(url)
            .then(downloadData => renderNewDistrictList(downloadData, selectedAdmAreaText))
        else downloadForm(url)
            .then(downloadData => renderDistrictList(downloadData))
        ///////////////////////////////////////////////////////////////////////////////////////////

    }


}


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
} // функция для генерации случайного числа