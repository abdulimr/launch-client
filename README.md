# Launch Client

To build, please run the following commands in the root directory of this repository.
```
npm i
npm run build
```

## Implementation Details

This frontend application is made with React.js and is a client-side application. This means that data is fetched from the Launch API on the client's side once the page loads.

The following open-source libraries were used to provide additional functionality:
  - Pigeon Maps (for the Map - uses OpenStreetMaps)
  - Chart.js (for the bar graph)
  - TailwindCSS (for faster CSS styling using utility classes)


## Features
- When scrolling near the table's end, newer data is automatically loaded (lazy loading on scroll) if the API does not provide the entire list of launches initially. This only occurs when the API limits its response to a maximum number of launches per request.

- By default, the application assumes all launches are saved and includes them in the map and bar graph. However, pressing the unsave button of a row will remove that launch from the map and bar graph.

- The entire application is responsive and is supported and usable on smaller screens such as mobile devices.

- The application automatically loads data when the dates change which reduces the number of steps needed to get new data.
