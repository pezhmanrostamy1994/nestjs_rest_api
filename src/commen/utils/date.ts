import * as shamsiDateConverter from 'shamsi-date-converter';
export const getFullHouer = () => {
  const houre = new Date().getHours();
  const minute = new Date().getMinutes();
  const seconds = new Date().getSeconds();
  return {
    houre,
    minute,
    seconds,
  };
};
export const converToShamsi = (date = new Date()) => {
  const shamsiDate = shamsiDateConverter.gregorianToJalali(date);
  const objectShamsiDate = {
    year: shamsiDate[0],
    month: shamsiDate[1] < 10 ? `0${shamsiDate[1]}` : shamsiDate[1],
    day: shamsiDate[2] < 10 ? `0${shamsiDate[2]}` : shamsiDate[2],
    houre:
      getFullHouer().houre < 10
        ? `0${getFullHouer().houre}`
        : getFullHouer().houre,
    minute:
      getFullHouer().minute < 10
        ? `0${getFullHouer().minute}`
        : getFullHouer().minute,
    seconds:
      getFullHouer().seconds < 10
        ? `0${getFullHouer().seconds}`
        : getFullHouer().seconds,
  };
  const stringShamsiDate = `${objectShamsiDate.year}${objectShamsiDate.month}${objectShamsiDate.day}${objectShamsiDate.houre}${objectShamsiDate.minute}${objectShamsiDate.seconds}`;
  const numberShamsiDate = Number(stringShamsiDate);
  return {
    shamsiDate,
    objectShamsiDate,
    stringShamsiDate,
    numberShamsiDate,
  };
};
