$(document).ready(function () {
  $('a[name="addProduct"]').hide()
  $('a[name="removeProduct"]').hide()
  let turnedOn = false

  $('a[name="editProducts"]').on('click', function () {
    turnedOn = !turnedOn

    if (turnedOn) {
      $('a[name="addProduct"]').show()
      $('a[name="removeProduct"]').show()
    } else {
      $('.addProductContainer').hide()
      $('.removeProductContainer').hide()
      $('a[name="addProduct"]').hide()
      $('a[name="removeProduct"]').hide()
    }
  })
})
