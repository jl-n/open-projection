#Todo
- Make the map downloadable DONE
- Add colour schema DONE
- Add titles DONE
- add geolocation DONE
- Sop things jumping around each drag DONE
- Make dragging around high quality DONE
- Make text render centrally rather than from the left DONE
- Graticules DONE
- Bathymetry DONE
- Make it render quicker by not rendering the download map page until only when neccesary DONE
- Make projection changeable DONE
- Add projection to url params DONE
- Make the url configs more robust (type sanitation) DONE
- Add .png and .svg options to download button DONE
- Refactor app.js functions into Util object DONE
- Refactor map components into a map folder DONE
- Make download aspect ratio match projected map DONE
- Ensure text is sized reasonably at all map sizes DONE

- Checkbox for graticules
- Checkbox for labels
- Question mark popup for the "about this project"

#Maybe for the future:
- Add radio boxes to enable (or disable) various map layers
- Hide toolbar
- Would be cute (and part of another quick project) to make a small globe avatar react npm package

#First release MVP goal:
- geolocation DONE
- Url encoded parameters DONE
- Two or three color themes? DONE

# Further notes:
What makes the Mapbox (and other maps) look nice is the land has shaded contours of elevation, and the land has shaded areas of green to pale to indicate climate

# Bug tracking:
- The slight drag glitch issue because of RX (solved by not using RX) FIXED
- The map still dragging when selecting non map items (solved by not using RX) FIXED
- The resetting of the map when a new search is made FIXED
- When rendering the svg FIXED
  - The download takes for fucking ever because file so large, data uri cant handle it
  - Special characters like Å (in Åland - the fuck) cause other programs to not be able to load it. I need to parse all labels to replace instances of this
    https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
    Look into entity encoding (some kind of escaping of characters)

Responsibilities of components:
- Map: from some basic parameters, renders a map
- MapRenderer: enables animation, drag behaviour
- App: geolocation, styles, etc.


How downloading will work:
- Map component takes a set of parameters including a callback that calls when the map has been dragged
- Parameters include the map style
