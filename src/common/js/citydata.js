import REGION_DATA from '@/common/js/data';

const provinceObject = REGION_DATA['86']; // 省份对象
const regionData = [];

// 计算省
for (const prop in provinceObject) {
  regionData.push({
    id: prop, // 省份code值
    name: provinceObject[prop] // 省份汉字
  });
}

// 计算市
for (let i = 0, len = regionData.length; i < len; i++) {
  const provinceCode = regionData[i].id;
  const provinceText = regionData[i].name;
  const cityArray = [];
  for (const prop in REGION_DATA[provinceCode]) {
    cityArray.push({
      id: prop,
      name: REGION_DATA[provinceCode][prop]
    });
  }
  if (cityArray.length) {
    regionData[i].city = cityArray;
  }
}

// 计算区
for (let i = 0, len = regionData.length; i < len; i++) {
  const province = regionData[i].city;
  const provinceText = regionData[i].name;
  if (province) {
    for (let j = 0, len = province.length; j < len; j++) {
      const cityCode = province[j].id;
      const cityText = province[j].name;
      const cityChildren = [];
      for (const prop in REGION_DATA[cityCode]) {
        cityChildren.push({
          id: prop,
          name: REGION_DATA[cityCode][prop]
        });
      }
      if (cityChildren.length) {
        province[j].district = cityChildren;
      }
    }
  }
}

export default {
  regionData: regionData
};
