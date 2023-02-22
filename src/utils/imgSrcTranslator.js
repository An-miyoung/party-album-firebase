export const imgSrcTranslator = (rawData) => {
  const splittedArray1 = rawData.split("/");
  const splittedArray2 = splittedArray1.pop().split("?");
  const imgSrc = splittedArray2[0].replaceAll("%2F", "/");
  return imgSrc;
};
