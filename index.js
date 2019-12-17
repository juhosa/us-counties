import fs from "fs";
import axios from "axios";
import cheerio from "cheerio";

const url =
  "https://en.wikipedia.org/wiki/List_of_United_States_counties_and_county_equivalents";

const getData = async () => {
  let d = await axios.get(url);

  return d;
};

const getNames = data => {
  let names = [];
  const $ = cheerio.load(data);
  const as = $(".wikitable tbody tr td:first-child > a");
  as.each(function(i, a) {
    names.push($(this).text());
    // console.log($(this).text());
  });
  return names;
};

const writeFile = (filename, data) => {
  let file = fs.createWriteStream(filename);

  file.on("error", err => {
    console.log(err);
  });

  for (let name of data) {
    file.write(name + "\n");
  }

  file.end();
};

const start = async () => {
  const data = await getData();
  //   console.log(data.data);
  const names = getNames(data.data);
  //   console.log(names);

  writeFile("county_names.txt", names);
};

start();
