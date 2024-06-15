import { saveCustomer, getAllCustomers, updateCustomer, deleteCustomer } from '../model/CustomerModel.js';

document.addEventListener('DOMContentLoaded', function() {
    refresh();
});

document.querySelector('#CustomerManage #customerForm').addEventListener('submit', function(event) {
    event.preventDefault();
});

let custId;
let custName;
let custAddress;
let custSalary;

document.querySelector('#CustomerManage .saveBtn').addEventListener('click', function() {
    custId = document.querySelector('#CustomerManage .custId').value;
    custName = document.querySelector('#CustomerManage .custName').value;
    custAddress = document.querySelector('#CustomerManage .custAddress').value;
    custSalary = document.querySelector('#CustomerManage .custSalary').value;

    let customer = {
        custId: custId,
        custName: custName,
        custAddress: custAddress,
        custSalary: custSalary
    };

    let validResult = validate(customer);

    if (validResult) {
        saveCustomer(customer);
        refresh();
    }
});

function validate(customer) {
    let valid = true;

    if ((/^C0[0-9]+$/).test(customer.custId)) {
        document.querySelector('#CustomerManage .invalidCustId').textContent = '';
        valid = true;
    } else {
        document.querySelector('#CustomerManage .invalidCustId').textContent = 'Invalid Customer Id';
        valid = false;
    }

    if ((/^(?:[A-Z][a-z]*)(?: [A-Z][a-z]*)*$/).test(customer.custName)) {
        document.querySelector('#CustomerManage .invalidCustName').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustName').textContent = 'Invalid Customer Name';
        valid = false;
    }

    if ((/^[A-Z][a-z, ]+$/).test(customer.custAddress)) {
        document.querySelector('#CustomerManage .invalidCustAddress').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustAddress').textContent = 'Invalid Customer Address';
        valid = false;
    }

    if (customer.custSalary != null && customer.custSalary > 0) {
        document.querySelector('#CustomerManage .invalidCustSalary').textContent = '';
    } else {
        document.querySelector('#CustomerManage .invalidCustSalary').textContent = 'Invalid Customer Salary';
        valid = false;
    }

    let customers = getAllCustomers();
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].custId === customer.custId) {
            document.querySelector('#CustomerManage .invalidCustId').textContent = 'Customer Id Already Exists';
            valid = false;
        }
    }

    return valid;
}

function loadTable(customer) {
    let tableRow = document.querySelector('#CustomerManage .tableRow');
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${customer.custId}</td>
        <td>${customer.custName}</td>
        <td>${customer.custAddress}</td>
        <td>${customer.custSalary}</td>
    `;
    tableRow.appendChild(newRow);
}

function extractNumber(id) {
    var match = id.match(/C0(\d+)/);
    if (match && match.length > 1) {
        return parseInt(match[1]);
    }
    return null;
}

function createCustomerId() {
    let customers = getAllCustomers();
    
    if (!customers || customers.length === 0) {
        return 'C01';
    } else {
        let lastCustomer = customers[customers.length - 1];
        let id = lastCustomer && lastCustomer.custId ? lastCustomer.custId : 'C00';
        
        let number = extractNumber(id);
        number++;
        return 'C0' + number;
    }
}

function refresh() {
    document.querySelector('#CustomerManage .custId').value = createCustomerId();
    document.querySelector('#CustomerManage .custName').value = '';
    document.querySelector('#CustomerManage .custAddress').value = '';
    document.querySelector('#CustomerManage .custSalary').value = '';
    document.querySelector('#CustomerManage .invalidCustId').textContent = '';
    document.querySelector('#CustomerManage .invalidCustName').textContent = '';
    document.querySelector('#CustomerManage .invalidCustAddress').textContent = '';

    reloadTable();
}

document.querySelector('#CustomerManage .cleatBtn').addEventListener('click', function() {
    refresh();
});

document.querySelector('#CustomerManage .searchBtn').addEventListener('click', function() {
    let customerId = document.querySelector('#CustomerManage .custId').value;
    let customer = searchCustomer(customerId);
    if (customer) {
        document.querySelector('#CustomerManage .custName').value = customer.custName;
        document.querySelector('#CustomerManage .custAddress').value = customer.custAddress;
        document.querySelector('#CustomerManage .custSalary').value = customer.custSalary;
    } else {
        alert('Customer Not Found');
    }
});

document.querySelector('#CustomerManage .updateBtn').addEventListener('click', function() {
    let updateCustomerId = document.querySelector('#CustomerManage .custId').value;
    let updateCustomer = {
        custId: updateCustomerId,
        custName: document.querySelector('#CustomerManage .custName').value,
        custAddress: document.querySelector('#CustomerManage .custAddress').value,
        custSalary: document.querySelector('#CustomerManage .custSalary').value
    };

    let validResult = validate(updateCustomer);

    if (validResult) {
        let customers = getAllCustomers();
        let index = customers.findIndex(c => c.custId === updateCustomer.custId);
        updateCustomer(index, updateCustomer);
        refresh();
    }
});

function reloadTable() {
    let customers = getAllCustomers();
    let tableRow = document.querySelector('#CustomerManage .tableRow');
    tableRow.innerHTML = '';
    customers.forEach(c => {
        loadTable(c);
    });
}

document.querySelector('#CustomerManage .removeBtn').addEventListener('click', function() {
    let customers = getAllCustomers();
    let customerId = document.querySelector('#CustomerManage .custId').value;
    let index = customers.findIndex(c => c.custId === customerId);
    if (index >= 0) {
        deleteCustomer(index);
        refresh();
    } else {
        alert('Customer Not Found');
    }
});

document.querySelector('#CustomerManage .tableRow').addEventListener('click', function(event) {
    let target = event.target;
    if (target.tagName === 'TD') {
        let row = target.parentNode;
        let id = row.children[0].textContent;
        let name = row.children[1].textContent;
        let address = row.children[2].textContent;
        let salary = row.children[3].textContent;
        document.querySelector('#CustomerManage .custId').value = id;
        document.querySelector('#CustomerManage .custName').value = name;
        document.querySelector('#CustomerManage .custAddress').value = address;
        document.querySelector('#CustomerManage .custSalary').value = salary;
    }
});
