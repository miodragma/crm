export const dateToTimestamp = value => {
  const { year, month, day } = getDateData(value)
  const date = `${year}-${month}-${day}`
  return new Date(date).getTime();
}

export const getDateData = value => {
  const currValue = new Date(value);
  currValue.setHours(0, 0, 0, 0);
  const month = ("0" + (currValue.getMonth() + 1)).slice(-2);
  const day = currValue.getDate();
  const year = currValue.getFullYear();
  return { day, month, year };
};

export const timestampToDate = value => {
  const { year, month, day } = getDateData(+value)
  return value ? `${("0" + day).slice(-2)}-${month}-${year}` : '';
}

export const inputTypeDate = val => {
  const dateToInput = getDateData(val);
  return val ? `${dateToInput.year}-${dateToInput.month}-${("0" + dateToInput.day).slice(-2)}` : '';
}

const timeOptions = { hour12: true, hour: 'numeric', minute: '2-digit', hour12suffix: true };

export const formatTime = (dateTime) => {
  const time = dateTime.toLocaleTimeString([], timeOptions);
  return timeOptions.hour12suffix ? time : time.replace('AM', '').replace('PM', '')
};
