# Votechain: A Decentralized Voting System

## Overview

Votechain is a decentralized voting application built on the Cartesi platform. It allows users to create elections, cast votes, and view results in a transparent and verifiable manner. By leveraging Cartesi's off-chain computation capabilities, Votechain provides a scalable and efficient voting system while maintaining the security and transparency of blockchain technology.

## Features

- Create and manage multiple elections
- Cast votes in active elections
- View real-time election results
- End active elections
- List all active elections

## Architecture

Votechain is built using TypeScript and follows a modular architecture:

- `src/index.ts`: Main application entry point, handles incoming requests and routes them to the appropriate controller methods.
- `src/models/vote.ts`: Defines the data structures for votes and elections.
- `src/storage/voteStorage.ts`: Manages the in-memory storage of votes and elections.
- `src/controllers/voteController.ts`: Contains the business logic for handling voting operations.
- `src/schema.d.ts`: TypeScript definitions for the Cartesi Rollups API.

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/votechain.git
   cd votechain
   ```

2. Install dependencies:
   ```
   yarn install
   ```

3. Build the project:
   ```
   yarn build
   ```

4. Start the Cartesi Rollups environment (refer to Cartesi documentation for detailed instructions).

5. Run the application:
   ```
   yarn start
   ```

## Usage

Votechain interacts with the Cartesi Rollups API. Here are the main operations:

### Create an Election
```json
{
"method": "createElection",
"params": {
"electionName": "Presidential Election 2024"
}
}
```


### Cast a Vote

```json
{
"method": "castVote",
"params": {
"candidate": "Candidate A",
"electionName": "Presidential Election 2024"
}
}
```


### Get Election Results

```json
{
"method": "getResults",
"params": {
"electionName": "Presidential Election 2024"
}
}

```


### End an Election

```json
{
"method": "endElection",
"params": {
"electionName": "Presidential Election 2024"
}
}
```


### Get Active Elections

```json
{
"method": "getElections"
}
```


## Security Considerations

- Votechain ensures that votes can only be cast in active elections.
- Each vote is associated with the voter's address, preventing double voting.
- Election creation and termination are recorded as notices on the blockchain for transparency.
- Vote results are computed off-chain but can be verified on-chain.

## Limitations and Future Improvements

- Currently, the application uses in-memory storage. For production use, implement persistent storage.
- Add voter registration and verification mechanisms.
- Implement more sophisticated voting systems (e.g., ranked-choice voting).
- Enhance privacy features to protect voter anonymity.
- Add unit tests and integration tests for robustness.

## Contributing

Contributions to Votechain are welcome! Please fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Cartesi team for providing the rollups infrastructure
- OpenAPI and TypeScript communities for excellent tooling
