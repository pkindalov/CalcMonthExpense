$(document).ready(function () {
  $('.addProductContainer').hide()
  $('.removeProductContainer').hide()

  let turnedOn = false
  let removeProductButtonTurnedOn = false

  $('a[name="addProduct"]').on('click', function () {
      turnedOn = !turnedOn
      if (turnedOn) {
           $('.addProductContainer').show()
         }else {
           $('.addProductContainer').hide()
         }
    })

  $('a[name="removeProduct"]').on('click', function () {
     removeProductButtonTurnedOn = !removeProductButtonTurnedOn
     if (removeProductButtonTurnedOn) {
           $('.removeProductContainer').show()
         }else {
           $('.removeProductContainer').hide()
         }
   })
})
