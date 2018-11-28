#Todo
- Make the map downloadable https://jsbin.com/dusanisuwo/3/edit?html,js,output
- Add colour schema
- Make projection changeable
- Add titles DONE
- add geolocation DONE
- Sop things jumping around each drag - ~DONE
- Make dragging around high quality DONE
- Make text render centrally rather than from the left DONE
- Graticules DONE
- Bathymetry DONE


#Ideas
- Consider layers - people can select what goes onto the exported print ready svg file
- Consider url parameters - if people share the url of the map they have made, could it render the exact same for the other person?

#First release MVP goal:
- Exportable SVG with printmarks
- geolocation
- Url encoded parameters
- Two or three color themes?

# Further notes:
What makes the Mapbox (and other maps) look nice is the land has shaded contours of elevation, and the land has shaded areas of green to pale to indicate climate

# Bug tracking:
- The slight drag glitch issue because of RX (solved by not using RX) FIXED
- The map still dragging when selecting non map items (solved by not using RX) FIXED
- The resetting of the map when a new search is made FIXED
- When rendering the svg
  - The download takes for fucking ever because file so large, data uri cant handle it
  - Special characters like Å (in Åland - the fuck) cause other programs to not be able to load it. I need to parse all labels to replace instances of this
    https://en.wikipedia.org/wiki/List_of_XML_and_HTML_character_entity_references
    Look into entity encoding (some kind of escaping of characters)
    
Responsibilities of components:
- Map: from some basic parameters, renders a map
- MapRenderer: enables animation, drag behaviour
- App: geolocation, styles, etc.
