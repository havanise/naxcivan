export const accountTypes = [
    { id: 1, label: 'Nağd' },
    { id: 2, label: 'Bank' },
    { id: 3, label: 'Kart' },
    { id: 4, label: 'Digər' },
];

export const re_paymentAmount = /^[0-9]{1,9}\.?[0-9]{0,2}$/;
export const re_amount = /^[0-9]{0,12}\.?[0-9]{0,4}$/;
export const re_percent = /^[0-9]{1,9}\.?[0-9]{0,4}$/;


export const fullDateTimeWithSecond = 'DD-MM-YYYY HH:mm:ss';