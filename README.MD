# CSV to GeoJSON
This is a simple js programm to convert a Google Takeout CSV of a shared list and convert it to GeoJSON, so you can convert it into KML to import to Google MyMaps.

This Program will open the link and get the Latitude and Longitude from the URL, save it to the result.json
and then proceed and convert it to the GeoJSON format you can proceed to convert to KML and put into My Maps.

1. You need a CSV File that looks like this:

| Name                    | URL                                   |
|-------------------------|---------------------------------------|
| Name of the Saved Place | https://www.google.com/maps/place/... |

2. Clone this directory and execute `npm install`, `yarn` or `pnpm i` in the commandline.
3. Place the CSV file in this directory.
4. Execute `node index.js` and wait for the Program to finish, when you get the `geojson.json` you can press `CTRL+C`.
5. **Enjoy!**



