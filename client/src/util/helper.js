
export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })
}

export const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
    })
}

export const getMessagesStatus = (status) => {

    switch (status) {
        case "pending":
          return "กำลังดำเนินการ"
        case "completed":
          return "ชำระเงินเสร็จสิ้น"
        case "waiting_delivery":
          return "รอจัดส่ง"
        case "shipping":
          return "กำลังจัดส่ง" 
        case "shipped":
          return "จัดส่งแล้ว"
        case "delivered":
          return "จัดส่งเสร็จสิ้น"
        default:
          return "ไม่พบสถานะ"
    }

}

export const getMessagePayment = (paymentStatus) => {
    switch (paymentStatus) {
      case "qrCode":
        return "QR Code"
      case "Cash":
        return "เงินสด"
      default:
        break;
    }
}