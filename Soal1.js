function checkAnagram(str1, str2) {
  if (str1.length !== str2.length) return false;

  var freq = {};

  for (var i = 0; i < str1.length; i++) {
    var char = str1[i];

    if (!(char in freq)) {
      freq[char] = 1;
    } else {
      freq[char] += 1;
    }
  }

  for (var i = 0; i < str2.length; i++) {
    var char = str2[i];

    if (!(char in freq)) {
      return false;
    } else if (freq[char] === 0) {
      return false;
    } else {
      freq[char] -= 1;
    }
  }

  for (var key in freq) {
    if (freq[key] > 0) {
      return false;
    }
  }

  return true;
}

var strings = ["kita", "atik", "tika", "aku", "kia", "makan", "kua"];

var groupedAnagram = {};

for (var i = 0; i < strings.length; i++) {
  var exist = false;
  for (var key in groupedAnagram) {
    if (checkAnagram(strings[i], key)) {
      groupedAnagram[key].push(strings[i]);
      exist = true;
      break;
    }
  }
  if (!exist) {
    groupedAnagram[strings[i]] = [strings[i]];
  }
}

var list = [];

for (var key in groupedAnagram) {
  list.push(groupedAnagram[key]);
}

console.log(list);
