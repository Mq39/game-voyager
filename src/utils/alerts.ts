import Swal from "sweetalert2"

export const confirmRemoveFromCart = async (): Promise<boolean> => {
    const result = await Swal.fire({
        title: "Remove item?",
        text: "Are you sure you want to remove this item from your cart?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, remove it",
        cancelButtonText: "No",
        background: "#26263a",
        color: "#ffffff",
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280"
    })

    return result.isConfirmed
}

export const showSuccessToast = (title: string): void => {
    void Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "success",
        title,
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        background: "#26263a",
        color: "#ffffff"
    })
}

export const showInfoToast = (title: string): void => {
    void Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "info",
        title,
        showConfirmButton: false,
        timer: 2200,
        timerProgressBar: true,
        background: "#26263a",
        color: "#ffffff"
    })
}

export const showAuthRequiredToast = (message: string) => {
    return Swal.fire({
        toast: true,
        position: "bottom-end",
        icon: "warning",
        title: message,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "#26263a",
        color: "#fff"
    })
}