export function getCurrentDate() {
    const currentDate = new Date();

    // Get the date components
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month as it is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Format the date
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

export function getPastDate(daysFromNow: number){
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate()-daysFromNow);
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Adding 1 to the month as it is zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    // Format the date
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}  