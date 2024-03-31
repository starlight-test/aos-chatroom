<script lang="ts">
  import Arweave from "arweave";
  import {
    result,
    results,
    createDataItemSigner,
    message,
    dryrun,
  } from "@permaweb/aoconnect";
  import ChatWindow from "../components/chat-section/ChatWindow.svelte";
  import { onMount } from "svelte";
  let allMessages: any[] = [];
  type Result = {
    cursor: string;
    node: {
      Messages: unknown[];
      Spawns: unknown;
      Output: {
        data: string;
        print: boolean;
        prompt: string;
      };
    };
  };
  async function getMessages() {
    let firstRes = await results({
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      sort: "DESC",
    });
    console.log({ firstRes });
    let firstResEdges: Result[] = firstRes.edges;
    let got_messages: any[] = [];
    let messageEdges: Result[] | undefined;
    let next_cursor = "";
    while (next_cursor !== "END") {
      if (next_cursor !== "") {
        const messages = await results({
          process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
          sort: "DESC",
          from: next_cursor,
        });
        console.log({ messages });
        messageEdges = messages.edges;
      }
      if (next_cursor === "") {
        firstResEdges.forEach((item) => {
          const Messages = item.node.Messages;
          if (Messages.length > 0) {
            if (item) {
              console.log(Messages[0]);
              let author = "Anonymous";
              for (let j = 0; j < Messages[0].Tags.length; j++) {
                if (Messages[0].Tags[j].name === "Nickname") {
                  author = Messages[0].Tags[j].value;
                }
              }
              got_messages.push({
                name: author,
                message: Messages[0].Data,
                isDisplayable: true,
                // "time": new Date(item.Messages[0].Timestamp).toISOString()
                time: new Date().toISOString(),
              });
            }
          }
          firstRes;
        });
        console.log("Cursor :", firstResEdges.slice(-1)[0].cursor);
        next_cursor = firstResEdges[0].cursor || "END";
      }
      if (messageEdges) {
        messageEdges.forEach((item) => {
          const Messages = item.node.Messages;
          if (Messages.length > 0) {
            if (item) {
              console.log(Messages[0]);
              let author = "Anonymous";
              for (let j = 0; j < Messages[0].Tags.length; j++) {
                if (Messages[0].Tags[j].name === "Nickname") {
                  author = Messages[0].Tags[j].value;
                }
              }
              got_messages.push({
                name: author,
                message: Messages[0].Data,
                isDisplayable: true,
                // "time": new Date(item.Messages[0].Timestamp).toISOString()
                time: new Date().toISOString(),
              });
            }
          }
          firstRes;
        });
        const candidate_next_cursor = messageEdges?.[0]?.cursor || "END";
        console.log(candidate_next_cursor);
        if (next_cursor === candidate_next_cursor) {
          console.log("same cursor we fucked");
          next_cursor = "END";
        } else {
          next_cursor = candidate_next_cursor;
        }
      }
    }
    allMessages = got_messages;
  }

  onMount(async () => {
    const msgId = await message({
      data: "Members",
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      signer: createDataItemSigner(window.arweaveWallet),
    });
    console.log({ msgId });
    const res = await result({
      message: msgId,
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
    });
    console.log({ res });

    const dryrunres = await dryrun({
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      data: "Members",
    });
    console.log(dryrunres);
    await getMessages();
    console.log(allMessages);
  });
</script>

<ChatWindow msgs={allMessages} />
