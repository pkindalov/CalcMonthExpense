
module.exports = {
  getTodayDateWithoutTime: (date) => {
    let day = date.getDate()
    let monthIndex = date.getMonth()
    let year = date.getFullYear()

    if (monthIndex < 10) {
      monthIndex = '0' + (monthIndex + 1)
    }

    let today = year + '-' + monthIndex + '-' + day

    return today
  },

  getThisMonthDateBegin: (date) => {
    let day = '01'
    let monthIndex = date.getMonth()
    let year = date.getFullYear()

    if (monthIndex < 10) {
      monthIndex = '0' + (monthIndex + 1)
    }

    let thisMonthDateBegin = year + '-' + day + '-' + monthIndex
    return thisMonthDateBegin
  },

  getCurrentMonth: (date) => {
    let currentMonth = date.getMonth() + 1
    let currentYear = date.getFullYear()

    let currentMonthDays = new Date(currentYear, currentMonth, 0).getDate()

    if (currentMonthDays < 10) {
      currentMonthDays = '0' + currentMonthDays
    }

    if (currentMonth < 10) {
      currentMonth = '0' + currentMonth
    }

    let endOfMonthDate = currentYear + '-' + currentMonth + '-' + currentMonthDays
    return endOfMonthDate
  }

}
