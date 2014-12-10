function DateValidator(yyyy, mm, dd) {
	this.yyyy = yyyy;
	this.mm = mm;
	this.dd = dd;

	var tmp_yyyy = parseInt(this.yyyy);
	if(tmp_yyyy >= 1000 && tmp_yyyy <= 9999)
		this.isCurrentYearValid = true;
	else
		this.isCurrentYearValid = false;

	this.isCurrentYearALeapYear = function() {
		if(this.isCurrentYearValid)
			return tmp_yyyy % 4 == 0 ? true : false;
		else
			return undefined;
	}

	var tmp_mm = parseInt(this.mm);
	if(tmp_mm <= 12 && tmp_mm >= 1)
		this.isCurrentMonthValid = true;
	else
		this.isCurrentMonthValid = false;

	var tmp_dd = parseInt(this.dd);
	if(tmp_dd >= 1 && tmp_dd <= 31) {
        if(this.isCurrentMonthValid) {
            if(tmp_mm == 4 || tmp_mm == 6 || tmp_mm == 9 || tmp_mm == 11) {
                if(tmp_dd <= 30)
                    this.isCurrentDayValid = true;
                else
                    this.isCurrentDayValid = false;
            } else if(tmp_mm == 2) {
                if(this.isCurrentYearValid) {
                    if((this.isCurrentYearALeapYear() && tmp_dd <= 29) || (this.isCurrentYearALeapYear() == false && tmp_dd <= 28)) {
						this.isCurrentDayValid = true;
                    }
                    else {
                        this.isCurrentDayValid = false;
                    }
                } else if (tmp_dd <= 29) {
                    this.isCurrentDayValid = true;
                } else {
                    this.isCurrentDayValid = false;
                }
            } else  {
                this.isCurrentDayValid = true;
            }
        } else {
            this.isCurrentDayValid = true;
        }
    } else {
        this.isCurrentDayValid = false;
    }

    this.isDateValid = this.isCurrentYearValid && this.isCurrentMonthValid && this.isCurrentDayValid;

	this.currentYear = function() {
		if(this.isCurrentYearValid)
			return tmp_yyyy;
		else
			return undefined;
	}

	this.coalesceYear = function() {
		if(this.isCurrentYearValid)
			return tmp_yyyy;
		else if(isNaN(tmp_yyyy))
			return new Date().getFullYear();
		else if (tmp_yyyy < 1000)
			return 1000;
		else
			return 9999;
	}

	this.previousYear = function() {
		if(this.isCurrentYearValid) {
			if(tmp_yyyy > 1000)
				return new DateValidator(tmp_yyyy - 1, mm, dd);
			else
				return undefined;
		} else {
			return undefined;
		}
	}

	this.nextYear = function() {
		if(this.isCurrentYearValid) {
			if(tmp_yyyy < 9999)
				return new DateValidator(tmp_yyyy + 1, mm, dd);
			else
				return undefined;
		} else {
			return undefined;
		}
	}

	this.currentMonth = function() {
		if(this.isCurrentMonthValid)
			return tmp_mm;
		else
			return undefined;
	}

	this.coalesceMonth = function() {
		if(this.isCurrentMonthValid)
			return tmp_mm;
		else if(isNaN(tmp_mm))
			return new Date().getMonth();
		else if(tmp_mm > 12)
			return 12;
		else
			return 1;
	}

	this.lastDayOfCurrentMonth = function() {
		if(tmp_mm == 1 || tmp_mm == 3 || tmp_mm == 5 || tmp_mm == 7 || tmp_mm == 8 || tmp_mm == 10 || tmp_mm == 12)
			return 31;
		else if (tmp_mm == 4 || tmp_mm == 6 || tmp_mm == 9 || tmp_mm == 11)
			return 30;
		else if (this.isCurrentYearALeapYear())
			return 29;
		else
			return 28;
	}

	this.previousMonth = function() {
		if(this.isCurrentMonthValid) {
			if(tmp_mm > 1)
				return new DateValidator(yyyy, tmp_mm - 1, dd);
			else 
				return new DateValidator(this.previousYear().yyyy, 12, dd);
		} else {
			return undefined;
		}
	}

	this.nextMonth = function() {
		if(this.isCurrentMonthValid) {
			if(tmp_mm < 12)
				return new DateValidator(yyyy, tmp_mm + 1, dd);
			else 
				return new DateValidator(this.nextYear().yyyy, 1, dd);
		} else {
			return undefined;
		}
	}

	this.currentDay = function() {
		if(this.isCurrentDayValid)
			return tmp_dd;
		else
			return undefined;
	}

	this.coalesceDay = function() {
		if(this.isCurrentDayValid)
			return tmp_dd;
		else if (isNaN(tmp_dd))
			return new Date().getDate();
		else if (tmp_dd < 1)
			return 1;
		else if (this.isCurrentMonthValid)
			return this.lastDayOfCurrentMonth();
		else
			return 31;
	}

	this.previousDay = function() {
		if(this.isCurrentDayValid) {
			if(tmp_dd > 1)
				return new DateValidator(yyyy, mm, tmp_dd - 1);
			else {
				var pm = this.previousMonth();
				return new DateValidator(pm.yyyy, pm.mm, this.lastDayOfCurrentMonth());
			}
		} else {
			return undefined;
		}
	}

	this.nextDay = function() {
		if(this.isCurrentDayValid) {
			if(this.isCurrentMonthValid) {
				var upper_b = 31;
				if(tmp_mm == 4 || tmp_mm == 6 || tmp_mm == 9 || tmp_mm == 11) {
					upper_b = 30;
				} else if (tmp_mm == 2) {
					if(this.isCurrentYearValid == false || this.isCurrentYearALeapYear())
						upper_b = 29;
					else
						upper_b = 28;
				}
				if(tmp_dd < upper_b)
					return new DateValidator(yyyy, mm, tmp_dd + 1);
				else {
					var nm = this.nextMonth();
					return new DateValidator(nm.yyyy, nm.mm, 1);
				}
			} else if(tmp_dd == 31) {
				return this;
			} else {
				return new DateValidator(yyyy, mm, tmp_dd + 1);
			}
		} else {
			return undefined;
		}
	}

	this.nicePrint = function() {
		console.log("Year: " + this.yyyy);
		console.log("Month: " + this.mm);
		console.log("Day: " + this.dd);
		console.log("Is Valid? " + (this.isDateValid ? 'Yes' : 'No'));
	}
}
