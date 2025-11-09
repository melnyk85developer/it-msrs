const prepareDate = (value: string | number | Date) => {
    const newDate = new Date(value);
    return {
        day: newDate.getDay(),
        month: newDate.getMonth() + 1
    }
}
export default prepareDate;