const User = require('../data/User')
const dateHelpers = require('../utilities/dateHelpers')

module.exports = {

  administrationGET: (req, res) => {
    let monthBeginDate = dateHelpers.getThisMonthDateBegin(new Date())
    let endOfTheMonth = dateHelpers.getCurrentMonth(new Date())

    let start = new Date(monthBeginDate)
    let end = new Date(endOfTheMonth)


    User
      .find({'registeredOn': {'$gte': start, '$lt': end}})
      .then(registerUsersTimeInterval => {

        User
            .find({})
            .then(totalUsers => {
                res.render('administration/administration', {
                  currentMontRegisteredUsers: registerUsersTimeInterval.length === 0,
                  registeredUsers: registerUsersTimeInterval,
                  startDate: monthBeginDate,
                  endDate: endOfTheMonth,
                  totalUsers: totalUsers
                })


            })

      })
  },

  administrationAJAX: (req, res) => {
    let monthBeginDate = dateHelpers.getThisMonthDateBegin(new Date())
    let endOfTheMonth = dateHelpers.getCurrentMonth(new Date())

    let start = new Date(monthBeginDate)
    let end = new Date(endOfTheMonth)

    User
      .find({'registeredOn': {'$gte': start, '$lt': end}})
      .then(registerUsersTimeInterval => {
        res.send(registerUsersTimeInterval)
      })
  },

  showAdminUsersAJAX: (req, res) => {
    User
      .find({'roles': 'Admin'})
      .then(foundedAdmins => {
        res.send(foundedAdmins)
      })
  },

  listAllUsersNotAdmins: (req, res) => {
    User
      .find({'roles': {'$ne': 'Admin'}})
      .then(users => {
        res.send(users)
      })
  }
}
