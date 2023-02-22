export const imgSrcTranslator = (rawData) => {
  const splittedArray1 = rawData.split("/");
  console.log(splittedArray1);
  const splittedArray2 = splittedArray1.pop().split("?");
  console.log(splittedArray2[0]);
  const imgSrc = splittedArray2[0].replaceAll("%2F", "/");
  console.log(imgSrc);

  return imgSrc;
};
