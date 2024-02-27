const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})

const addToCartButtons = document.querySelectorAll('.addToCart')
addToCartButtons.forEach(button => {
    button.addEventListener("click", e => {
        // const productId = e.target.id
        Toast.fire({
            icon: 'success',
            title: 'Product added to cart!'
        })
    })
})