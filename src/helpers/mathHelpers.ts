export const insertOrAcummulate = (
  key: string | number,
  value: number,
  obj: { [index: number]: string },
) => {
  if (obj.hasOwnProperty(key)) {
    return { ...obj, [key]: Math.round(obj[key] + value) };
  } else {
    return { ...obj, [key]: Math.round(value) };
  }
};

// transforms an array of objects containing a key with unique values into an object where
// its properties is the selected unique key

export const indexArray = <Type>(arr: Type[], indexKey: string) => {
  return arr.reduce((acc, element) => {
    let index = element[indexKey];
    return { ...acc, [index]: element };
  }, {} as { [key: string]: Type });
};

export const convertExsObjToArray = (obj: { [index: string | number]: any }) =>
  Object.entries(obj).map((entry) => entry[1]);

export const sampleArrayRandomly = (arr: any[], nSamples: number = 1) => {
  if (nSamples > arr.length) nSamples = arr.length;

  let samplesIndex = [];

  for (let index = 0; index < arr.length; index++) {
    samplesIndex.push(index);
  }
  let samples = [];
  while (nSamples > samples.length) {
    //sample one index
    let index = samplesIndex[Math.floor(Math.random() * samplesIndex.length)];
    samplesIndex = samplesIndex.filter((element) => element !== index);

    samples.push(arr[index]);
  }

  return samples;
};
