var monthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var Cal = function (divId, startYear, endYear) {
    //Store div id
    this.divId = divId;

    // Days of week, starting on Sunday
    this.DaysOfWeek = [ 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa' ];

    // Months, stating on January
    this.Months = monthArray

    // Year range
    this.yearArray = [];
    for (i = startYear; i <= endYear; i++) {
        this.yearArray.push(i);
    }

    // Set month, year
    var d = new Date();
    this.defaultSelectedDate = document.getElementById('fullDate').value;
    this.selectedDate = this.defaultSelectedDate.split('-');

    if (this.defaultSelectedDate != '') {
        this.currDay = this.selectedDate[0];
        this.currentMonth = this.selectedDate[1] - 1;
        this.currentYear = this.selectedDate[2];
    }
    else {
        this.currentMonth = d.getMonth();
        this.currentYear = d.getFullYear();
        this.currDay = d.getDate();
    }
};

// Goes to next month
Cal.prototype.nextMonth = function () {
    if (this.currentMonth == 11) {
        this.currentMonth = 0;
        this.currentYear = this.currentYear + 1;
    }
    else {
        this.currentMonth = this.currentMonth + 1;
    }
    this.showcurr();
};

// Goes to previous month
Cal.prototype.previousMonth = function () {
    if (this.currentMonth == 0) {
        this.currentMonth = 11;
        this.currentYear = this.currentYear - 1;
    }
    else {
        this.currentMonth = this.currentMonth - 1;
    }
    this.showcurr();
};

// Show current month
Cal.prototype.showcurr = function () {
    this.showMonth(this.currentYear, this.currentMonth);
}

// Show month (year, month)
Cal.prototype.showMonth = function (y, m) {
    mon = m + 1;
    yeear = y;

    // First day of the week in the selected month
    var firstDayOfMonth = new Date(y, m, 1).getDay()
    // Last day of the selected month
    var lastDateOfMonth = new Date(y, m + 1, 0).getDate()
    // Last day of the previous month
    var lastDayOfLastMonth = m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();

    var html = '<table id="table1">';

    // First row, start
    html += '<tr>';
    html += '<td colspan="5">';
    html += '<div class="firstTD">';

    html += '<select id="selectedMonth" onchange="getMonthAndYear()">';
    for (var i = 0; i < this.Months.length; i++) {
        html += '<option';
        html += (i == m) ? ' selected ' : '';
        html += ' value = "' + this.Months[i] + '" > ' + this.Months[i] + '</option > ';
    }
    html += '</select>';
    html += '<select id="selectedYear" onchange="getMonthAndYear()">';
    for (var i = 0; i < this.yearArray.length; i++) {
        html += '<option';
        html += (this.yearArray[i] == y) ? ' selected ' : '';
        html += ' value = "' + this.yearArray[i] + '" > ' + this.yearArray[i] + '</option > ';
    }
    html += '</select>';
    html += '</div>';
    html += '</td>';

    html += '<td colspan="1">';
    html += '<button id="btnPrev" onclick="prevMonth()"></button>';
    html += '</td>';
    html += '<td colspan="1">';
    html += '<button id="btnNext" onclick="nextMonth()"></button>';
    html += '</td>';
    html += '</tr>';
    // First row, end

    // Header of the days of the week
    html += '<tr class="days r">';
    for (var i = 0; i < this.DaysOfWeek.length; i++) {
        html += '<td>' + this.DaysOfWeek[i] + '</td>';
    }
    html += '</tr>';

    // Write the days
    var i = 1;
    do {
        var dow = new Date(y, m, i).getDay();

        // If Sunday, start new row
        if (dow == 0) {
            html += '<tr class="r">';
        }
        // If not Sunday but first day of the month
        // it will write the last days from the previous month
        else if (i == 1) {
            html += '<tr class="r">';
            var k = lastDayOfLastMonth - firstDayOfMonth + 1;
            for (var j = 0; j < firstDayOfMonth; j++) {
                html += '<td class="not-current"></td>';
                k++;
            }
        }

        // Write the current day in the loop
        var chk = new Date();
        var chkY = chk.getFullYear();
        var chkM = chk.getMonth() + 1;
        var chkD = chk.getDate();

        if (i == this.selectedDate[0] && mon == this.selectedDate[1] && yeear == this.selectedDate[2]) {
            html += '<td class="normal selectedDate" onclick="getFullDate(' + i + ')">' + i + '</td>';
        }
        else {
            html += '<td class="normal" onclick="getFullDate(' + i + ')">' + i + '</td>';
        }

        // If Saturday, closes the row
        if (dow == 6) {
            html += '</tr>';
        }
        // If not Saturday, but last day of the selected month
        // it will write the next few days from the next month
        else if (i == lastDateOfMonth) {
            var k = 1;
            for (dow; dow < 6; dow++) {
                html += '<td class="not-current"></td>';
                k++;
            }
        }

        i++;
    } while (i <= lastDateOfMonth);

    // Clear and today button
    html += '<tr>';
    html += '<td colspan="4" class="bottomButtons" onclick="clearDate()">CLEAR</td>';
    html += '<td colspan="3" class="bottomButtons" onclick="getTodayDate()">TODAY</td>';
    html += '</tr>';

    // Closes table
    html += '</table>';

    // Write HTML to the div
    document.getElementById(this.divId).innerHTML = html;
};


var cal;
var mon;
var yeear;

// Get full date in format (d-m-y)
function getFullDate(i) {
    const completeDate = i + '-' + mon + '-' + yeear;
    document.getElementById('fullDate').value = completeDate;
    document.getElementById('calendar').style.display = 'none';
}

// Get selected month and year and update calendar
function getMonthAndYear() {
    var selectedMonth = document.getElementById('selectedMonth').value;
    cal.currentMonth = monthArray.indexOf(selectedMonth);
    var selectedYear = document.getElementById('selectedYear').value;
    cal.currentYear = selectedYear;

    mon = cal.currentMonth;
    yeear = cal.currentYear;
    cal.showMonth(cal.currentYear, cal.currentMonth);
}
// Previous month
function prevMonth() {
    if (cal.currentMonth == 0 && cal.currentYear == cal.yearArray[0]) {
        document.getElementById('btnPrev').disabled = true;
        document.getElementById('btnPrev').style.cursor = 'not-allowed';
    }
    else {
        cal.previousMonth();
    }
}

// Next month
function nextMonth() {
    if (cal.currentMonth == 11 && cal.currentYear == cal.yearArray[cal.yearArray.length - 1]) {
        document.getElementById('btnNext').disabled = true;
        document.getElementById('btnNext').style.cursor = 'not-allowed';
    }
    else {
        cal.nextMonth();
    }
}

// Clear date
function clearDate() {
    document.getElementById('fullDate').value = '';
    document.getElementById('calendar').style.display = 'none';
}

// Get Today's date
function getTodayDate() {
    var d = new Date();
    document.getElementById('fullDate').value = d.getDate() + '-' + d.getMonth() + 1 + '-' + d.getFullYear();
    document.getElementById('calendar').style.display = 'none';
}

// Close calendar on clicking outside
window.onload = function () {
    document.onclick = function (e) {
        if (e.target.id != 'img' && e.target.id != 'calendar' && e.target.id != 'selectedMonth' && e.target.id != 'selectedYear' && e.target.id != 'btnPrev' && e.target.id != 'btnNext') {
            document.getElementById('calendar').style.display = 'none';
        }
        console.log(e)
    }
}

// Main Function
function getCalendar(id1, id2, startYear, endYear) {
    cal = new Cal(id2, startYear, endYear);
    cal.showcurr();
    document.getElementById(id1).style.display = 'block';
}

