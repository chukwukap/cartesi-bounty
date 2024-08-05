import createClient from "openapi-fetch";
import { components, operations, paths } from "./schema";
import { VoteController } from "./controllers/voteController";
import { Address, Hex } from "viem";

type AdvanceRequestData = components["schemas"]["Advance"];
type InspectRequestData = components["schemas"]["Inspect"];
type RequestHandlerResult = components["schemas"]["Finish"]["status"];
type RollupsRequest = components["schemas"]["RollupRequest"];

const rollupServer = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollupServer);

const voteController = new VoteController();

const handleAdvance = async (data: AdvanceRequestData): Promise<RequestHandlerResult> => {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = JSON.parse(data.payload);
  
  switch (payload.method) {
    case "castVote":
      await voteController.castVote({
        voter: data.metadata.msg_sender,
        candidate: payload.params.candidate,
        timestamp: data.metadata.timestamp
      });
      return "accept";
    case "createElection":
      await voteController.createElection(payload.params.electionName, data.metadata.msg_sender);
      return "accept";
    case "endElection":
      await voteController.endElection(payload.params.electionName, data.metadata.msg_sender);
      return "accept";
    default:
      console.log(`Invalid method: ${payload.method}`);
      return "reject";
  }
};

const handleInspect = async (data: InspectRequestData): Promise<void> => {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = JSON.parse(data.payload);

  switch (payload.method) {
    case "getResults":
      const results = await voteController.getResults(payload.params.electionName);
      console.log("Voting results:", results);
      break;
    case "getElections":
      const elections = await voteController.getElections();
      console.log("Active elections:", elections);
      break;
    default:
      console.log(`Invalid method: ${payload.method}`);
  }
};

const main = async () => {
  const client = createClient<paths>({ baseUrl: rollupServer });
  let status: RequestHandlerResult = "accept";
  
  while (true) {
    const { data, error, response } = await client.POST("/finish", {
      body: { status },
    });

    if (response.status === 200 && data) {
      const request = data as RollupsRequest;
      switch (request.request_type) {
        case "advance_state":
          status = await handleAdvance(request.data as AdvanceRequestData);
          break;
        case "inspect_state":
          await handleInspect(request.data as InspectRequestData);
          break;
      }
    } else if (response.status === 202) {
      console.log(await response.text());
    } else if (error) {
      console.error("Error:", error);
    }
  }
};

main().catch((e) => {
  console.log(e);
  process.exit(1);
});