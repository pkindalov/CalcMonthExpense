$(document).ready(function () {
  $('a[name="addProduct"]').hide()
  $('a[name="addCategory"]').hide()
  $('a[name="removeProduct"]').hide()
  $('a[name="removeCategory"]').hide()
  let turnedOn = false
  let categoryUpdateTurnOn = false

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

  $('a[name="editCategories"]').on('click', function () {
    categoryUpdateTurnOn = !categoryUpdateTurnOn

    if (categoryUpdateTurnOn) {
      $('a[name="addCategory"]').show()
      $('a[name="removeCategory"]').show()
    } else {
      $('.addCategoryContainer').hide()
      $('.removeCategoryContainer').hide()
      $('a[name="addCategory"]').hide()
      $('a[name="removeCategory"]').hide()
    }
  })
})
