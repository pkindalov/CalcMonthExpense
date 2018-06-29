
module.exports = {
  getTodayDateWithoutTime: (date) => {
    var day = date.getDate()
    var monthIndex = date.getMonth()
    var year = date.getFullYear()

    if (monthIndex < 10) {
      monthIndex = '0' + (monthIndex + 1)
    }

    let today = year + '-' + monthIndex + '-' + day

    return today
  }
}
