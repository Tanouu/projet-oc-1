# OlympicGamesStarter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Code Functionality

### Project Architecture

The project follows a modular architecture with the following folders:

- `components`: Contains all reusable components.
- `pages`: Contains components used for routing.
- `core`: Contains business logic, including services and models.

### Key Components

- `HomeComponent`: Displays a pie chart of medals by country and allows navigation to a country's details.
- `DetailsComponent`: Displays the details of a specific country's Olympic participations in a line chart.

### Services

- `OlympicService`: Provides Olympic data and the total number of Olympic Games.

### Interfaces

- `Olympic`: Represents the data of a country and its participations in the Olympic Games.

