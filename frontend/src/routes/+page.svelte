<script lang="ts">
  import Arweave from "arweave";
  import { results, createDataItemSigner, message } from "@permaweb/aoconnect";
  import ChatWindow from "../components/chat-section/ChatWindow.svelte";
  import { onMount } from "svelte";
  import type { JWKInterface } from "arweave/node/lib/wallet";
  const arweave = Arweave.init({});

  let wallet: JWKInterface | null = null;
  let messageData: string = "";
  $: messages = [];

  const generateWallet = async () => {
    wallet = await arweave.wallets.generate();
    localStorage.setItem("wallet", JSON.stringify(wallet));
    console.log(wallet);
  };

  async function getMessages() {
    let result = await results({
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      sort: "DESC",
      limit: 50,
    });
    console.log(result);
    result = result.edges.map((edge) => edge.node);
    let got_messages = [];
    result.forEach((item) => {
      if (item.Messages.length > 0) {
        if (item.Messages[0].Data) {
          console.log(item.Messages[0]);
          let author = "Anonymous";
          for (let j = 0; j < item.Messages[0].Tags.length; j++) {
            if (item.Messages[0].Tags[j].name === "Nickname") {
              author = item.Messages[0].Tags[j].value;
            }
          }
          got_messages.push({
            name: author,
            message: item.Messages[0].Data,
            isDisplayable: true,
            // "time": new Date(item.Messages[0].Timestamp).toISOString()
            time: new Date().toISOString(),
          });
        }
      }
    });
    messages = got_messages;
  }

  

  onMount(async () => {
    let localWallet = localStorage.getItem("wallet");
    wallet = localWallet ? JSON.parse(localWallet) : null;
    await getMessages();
  });
</script>

<ChatWindow msgs={messages} />
