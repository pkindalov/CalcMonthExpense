$(document).ready(function () {
  $('.addProductContainer').hide()
  $('.addCategoryContainer').hide()
  $('.removeProductContainer').hide()
  $('.removeCategoryContainer').hide()

  let turnedOn = false
  let removeProductButtonTurnedOn = false
  let turnedOnAddCategoryButton = false
  let turnedOnRemoveCategoryButton = false

  $('a[name="addProduct"]').on('click', function () {
    turnedOn = !turnedOn
    if (turnedOn) {
      $('.addProductContainer').show()
    } else {
      $('.addProductContainer').hide()
    }
  })

  $('a[name="addCategory"]').on('click', function () {
    turnedOnAddCategoryButton = !turnedOnAddCategoryButton
    if (turnedOnAddCategoryButton) {
      $('.addCategoryContainer').show()
    } else {
      $('.addCategoryContainer').hide()
    }
  })

  $('a[name="removeProduct"]').on('click', function () {
    removeProductButtonTurnedOn = !removeProductButtonTurnedOn
    if (removeProductButtonTurnedOn) {
      $('.removeProductContainer').show()
    } else {
      $('.removeProductContainer').hide()
    }
  })

  $('a[name="removeCategory"]').on('click', function () {
    turnedOnRemoveCategoryButton = !turnedOnRemoveCategoryButton
    if (turnedOnRemoveCategoryButton) {
      $('.removeCategoryContainer').show()
    } else {
      $('.removeCategoryContainer').hide()
    }
  })
})
