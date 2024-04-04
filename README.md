# Mystery Pokemon Server 

Welcome to the Mystery Pokemon server repository! This repository contains the server-side code for the [Mystery Pokemon game](https://github.com/parthiv11/mystery-pokemon), which utilizes PokeAPI and MindsDB for creating a captivating gaming experience.

e)

## Introduction

Mystery Pokemon is an interactive game that challenges players to guess the name of a Pokemon based on a series of clues provided. The game leverages PokeAPI, a comprehensive database of Pokemon-related data, for fetching Pokemon information. Additionally, MindsDB, an AI platform for predictive analytics, is used to answer question's based on the characteristics of the Pokemon.

This server repository houses the backend logic for handling client requests, fetching data from PokeAPI, answering question using MindsDB's OpenAI Integration.

## Setup

### Requirements

Before setting up the server, ensure you have the following prerequisites installed on your system:

- Node.js
- npm (Node Package Manager)

### Installation

To install and run the Mystery Pokemon server, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/parthiv11/mystery-server.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mystery-server
   ```

3. Install dependencies using npm:

   ```bash
   npm install
   ```

4. Configure environment variables:

   Rename a `.env.example` file to `.env` and populate variables in it:

5. Start the server:

   ```bash
   node index.js
   ```

   This will start the server at the specified port.

## Usage

Once the server is up and running, clients ( [Mystery Pokemon game](https://github.com/parthiv11/mystery-pokemon) ) can send requests to the server to interact with the game. The server provides endpoints for fetching Pokemon data and answering question ask by user.


## Contributing

Contributions to the Mystery Pokemon server repository are welcome! If you have ideas for improvements, new features, or bug fixes, feel free to open an issue or submit a pull request. Please ensure your contributions adhere to the project's coding standards and guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.