let customers = document.querySelector('table#customer > tbody');
let applierCustomers = document.querySelector('div.modal.customers-list .modal-body tbody');
let close = document.querySelector('.modal-footer > button');
let langSelector = document.querySelector('.dropdown > .dropdown-menu');
let apiUsersList = document.querySelector('div.modal.api-users-list .modal-body tbody');

function fetchJSONFile(path, callback) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if(httpRequest.readyState === 4 && httpRequest.status === 200){
            var response = JSON.parse(httpRequest.responseText);
            if(callback) callback(response);   
            response.forEach(customer => {
                addRow(customer);
            });
        }         
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}

fetchJSONFile('db.json', function (data) {
    // console.log(data);
});

function addRow(customer)
{
    let id = document.createElement('td');
    id.textContent = customer.id;

    let fullname = document.createElement('td');
    fullname.textContent = customer.name + " " + customer.surname;

    let image = document.createElement('td');
    var customerImg = new Image();
    customerImg.src = customer.img;
    customerImg.setAttribute("class", "banner-img");
    customerImg.setAttribute("alt", "Customer");
    customerImg.style.width = "50%";
    customerImg.style.borderRadius = "5px";
    image.append(customerImg);

    let salary = document.createElement('td');
    salary.textContent = customer.salary.value + customer.salary.currency;

    let activeLoan = document.createElement('td');

    let span = document.createElement('span');

    let perMonth = document.createElement('td');
    let activeLoanArr = customer.loans.filter(function (val) {
        return val.closed === false;
    });

    let resultPerMonth= 0;
    if(activeLoanArr.length > 0){
        span.className = "badge";
        span.style.backgroundColor = "green";
        span.style.borderRadius = "5px";
        span.textContent = "Active";
        activeLoan.append(span);
        
        activeLoanArr.forEach(loan => {
            resultPerMonth += loan.perMonth.value;
            perMonth.textContent = resultPerMonth + loan.perMonth.currency;
        });
    }
    else{
        span.className = "badge";
        span.style.backgroundColor = "red";
        span.style.borderRadius = "5px";
        span.textContent = "Deactive";
        activeLoan.append(span);
        perMonth.textContent = "Borcu yoxdur";
    }
    
    let applyForLoan = document.createElement('td');
    let button = document.createElement('button');
    button.className = "btn btn-primary";
    button.style.color = "white";
    button.textContent = "M??raci??t et";
    button.setAttribute("type", "button");
    button.setAttribute("aria-context-key", "button_apply");

    function IsClickable () {
        return customer.salary.value * 0.45 <= resultPerMonth;
    }
    if(IsClickable() == true){
        button.className += " disabled";
    }
    else{
        button.className += " ";
    } 
    
    let showDetailsAboutLoans = document.createElement('td');
    let details = document.createElement('button');
    details.className = "btn btn-info";
    details.style.color = "white";
    details.textContent = "??trafl?? >";
    details.setAttribute("type", "button");
    details.setAttribute("data-toggle", "modal");
    details.setAttribute("data-target", "#myModal");
    details.setAttribute("aria-context-key", "button_details");
    showDetailsAboutLoans.append(details);

    // Modal
    let Id;

    details.onclick = function () {
        applierCustomers.innerHTML = "";
        customer.loans.forEach(loan => {
            let applierTr = document.createElement('tr');
            
            let customerFullname = document.querySelector('div.modal.customers-list .modal-title');
            customerFullname.textContent = customer.name + " " + customer.surname;
            Id = customer.id;
            let applierLoaner = document.createElement('td');
            let applierAmount = document.createElement('td');
            let applierStatusLoan = document.createElement('td');
            let applierMonthlyPay = document.createElement('td');
            let applierDueAmount = document.createElement('td');
            let applierDate = document.createElement('td');

            applierLoaner.textContent = loan.loaner;
            applierAmount.textContent = `${loan.amount.value} ${loan.amount.currency}`;

            let span1 = document.createElement('span');
            if(!loan.closed){
                span1.className = "badge";
                span1.style.backgroundColor = "green";
                span1.style.borderRadius = "5px";
                span1.textContent = "Active";
                applierStatusLoan.append(span1);
            }
            else{
                span1.className = "badge";
                span1.style.backgroundColor = "red";
                span1.style.borderRadius = "5px";
                span1.textContent = "Deactive";
                applierStatusLoan.append(span1);
            }
            applierMonthlyPay.textContent = `${loan.perMonth.value} ${loan.perMonth.currency}`;
            applierDueAmount.textContent = `${loan.dueAmount.value} ${loan.dueAmount.currency}`;
            applierDate.textContent = `${loan.loanPeriod.start} - ${loan.loanPeriod.end}`;

            applierTr.appendChild(applierLoaner);
            applierTr.appendChild(applierAmount);
            applierTr.appendChild(applierStatusLoan);
            applierTr.appendChild(applierMonthlyPay);
            applierTr.appendChild(applierDueAmount);
            applierTr.appendChild(applierDate);
            applierCustomers.append(applierTr);
        });
    }                    
    
    applyForLoan.append(button);

    let tr = document.createElement('tr');
    tr.style.cursor = "pointer";
    
    tr.appendChild(id);
    tr.appendChild(fullname);
    tr.appendChild(image);
    tr.appendChild(salary);
    tr.appendChild(activeLoan);
    tr.appendChild(perMonth);
    tr.appendChild(applyForLoan);
    tr.appendChild(showDetailsAboutLoans);
   
    customers.append(tr);
}

function LocalStorageLang() {
    var local_store = {
        lang: "AZ",
        theme: "light"
    }
    var langs = {
        "EN": {
            table_column_id: "No:",
            table_column_fullname: "Name Surname",
            table_column_image: "Customer image",
            table_column_salary: "Monthly Salary",
            table_column_active_loan: "Active loan",
            table_column_monthly_pay: "Total monthly pay",
            table_column_apply_loan: "Apply for a loan",
            table_column_loans: "Loans",
            table_heading: "Credit score evaluation",
            button_apply: "Apply",
            button_details: "Details >",
            table_loaner: "Loaner",
            table_amount: "Amount",
            table_loan_status: "Status loan",
            table_monthly_pay: "Monthly pay",
            table_due_amount: "Due amount",
            table_loan_date: "Start date - end dates"
        },
        "AZ": {
            table_column_id: "No:",
            table_column_fullname: "Ad Soyad",
            table_column_image: "M????t??ri ????kili",
            table_column_salary: "Ayl??q g??lir",
            table_column_active_loan: "Aktiv kredit",
            table_column_monthly_pay: "??mumi ayl??q ??d??ni??",
            table_column_apply_loan: "Kredit m??raci??ti",
            table_column_loans: "Kreditl??r",
            table_heading: "Kredit bal??n??n qiym??tl??ndirilm??si",
            button_apply: "M??raci??t et",
            button_details: "??trafl?? >",
            table_loaner: "Kredit ver??n",
            table_amount: "Miqdar",
            table_loan_status: "Kredit v??ziyy??ti",
            table_monthly_pay: "Ayl??q ??d??n????",
            table_due_amount: "Miqdar ??zr??",
            table_loan_date: "Ba??lan????c tarixi - son tarix"
        }
    }

    let string_local_store = localStorage.getItem("local_store");

    if(string_local_store == null)
        localStorage.setItem("local_store", JSON.stringify(local_store));
    else
        local_store = JSON.parse(string_local_store);


    let lang = local_store.lang;
    document.querySelectorAll('[aria-context-key]').forEach(th => {
        let key = th.getAttribute('aria-context-key'); 
        th.textContent = langs[lang][key];
    });
}


document.querySelectorAll('#dropdownMenuButton + .dropdown-menu > .dropdown-item')
.forEach(a=> {
    a.onclick = function() {
        let selectedLang = a.getAttribute('href');

        var local_store = {
            lang: "AZ",
            theme: "light"
        };

        let string_local_store = localStorage.getItem("local_store");

        if(string_local_store != null)
            local_store = JSON.parse(string_local_store);
            local_store.lang = selectedLang;
            
            localStorage.setItem("local_store", JSON.stringify(local_store));            
            LocalStorageLang();

        return false;
    }
});

LocalStorageLang();

const themeSwitcher = document.getElementById("theme-switch");
// themeSwitcher.checked = false;

let string_local_store = localStorage.getItem("local_store");

var local_store = {
    lang: "AZ",
    theme: "light"
};

function clickHandler() {
    let string_local_store = localStorage.getItem("local_store");
     if(string_local_store == null)
            localStorage.setItem("local_store", JSON.stringify(local_store));
        else 
            local_store = JSON.parse(string_local_store);
        // console.log(this.checked);

    if (this.checked) {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        local_store.theme = "dark";
        localStorage.setItem("local_store", JSON.stringify(local_store));
    } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        local_store.theme = "light";
        localStorage.setItem("local_store", JSON.stringify(local_store));   
    }
}

themeSwitcher.addEventListener("change", clickHandler);

if(string_local_store == null)
    localStorage.setItem("local_store", JSON.stringify(local_store));
else
    local_store = JSON.parse(string_local_store);

if(local_store.theme == "light"){
        themeSwitcher.checked = false;
        document.body.className = "light";
        
}else{
    themeSwitcher.checked = true;
    document.body.className = "dark";
}

window.onload = checkTheme();

function checkTheme() {
    const localStorageTheme = localStorage.getItem("local_store");

    if (localStorageTheme !== null && localStorageTheme === "dark") {
        document.body.className = localStorageTheme;

        const themeSwitch = document.getElementById("theme-switch");
        themeSwitch.checked = true;
    }
}

// api
fetch(`https://randomuser.me/api/`)
.then(resp => {
    return resp.json();
})
.then(users => {
    return users.results[0];
})
.then(user => {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const image = document.getElementById("image");
    name.textContent = `${user.name.first} ${user.name.last}`;
    email.textContent = user.email;
    // created image
    var userImage = new Image();
    userImage.style.borderRadius = "50%";
    userImage.src = user.picture.medium;
    image.append(userImage);
    console.log(user)

    // click
    name.onclick = function () {
        apiUsersList.innerHTML = "";
            let apiUserTr = document.createElement('tr');
            let userFullname = document.querySelector('div.modal.api-users-list .modal-title');
            let userEmail = document.createElement('td');
            let userGender = document.createElement('td');
            let userAge = document.createElement('td');
            let userPhone = document.createElement('td');
            let userCountry = document.createElement('td');
            let userCity = document.createElement('td');
            let userStreet = document.createElement('td');
            let userPostcode = document.createElement('td');

            
            name.setAttribute("data-toggle", "modal");
            name.setAttribute("data-target", "#myModalUser");

            userFullname.textContent = `${user.name.first} ${user.name.last}`;
            userEmail.textContent = user.email;
            userGender.textContent = user.gender;
            userAge.textContent = user.dob.age;
            userPhone.textContent = user.phone;
            userCountry.textContent = user.location.country;
            userCity.textContent = user.location.city;
            userStreet.textContent = user.location.street.name;
            userPostcode.textContent = user.location.postcode;


       
    
                apiUserTr.appendChild(userFullname);
                apiUserTr.appendChild(userEmail);
                apiUserTr.appendChild(userGender);
                apiUserTr.appendChild(userAge);
                apiUserTr.appendChild(userPhone);
                apiUserTr.appendChild(userCountry);
                apiUserTr.appendChild(userCity);
                apiUserTr.appendChild(userStreet);
                apiUserTr.appendChild(userPostcode);





                apiUsersList.append(apiUserTr);
        
    } 
})

