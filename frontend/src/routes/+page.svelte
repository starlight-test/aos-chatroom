<script lang="ts">
  import Arweave from "arweave";
  import { results, createDataItemSigner, message } from "@permaweb/aoconnect";
  import ChatWindow from "../components/chat-section/ChatWindow.svelte";
  import { onMount } from "svelte";
  import type { JWKInterface } from "arweave/node/lib/wallet";
  const arweave = Arweave.init({});

  let wallet: JWKInterface | null = null;
  let messageData: string = "";
  let messages;

  const generateWallet = async () => {
    wallet = await arweave.wallets.generate();
    localStorage.setItem("wallet", JSON.stringify(wallet));
    console.log(wallet);
  };
  $: messages = [];

  async function getMessages() {
    let result = await results({
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      sort: "DESC",
      limit: 50,
    });
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

  const sendMessage = async () => {
    const localWallet = localStorage.getItem("wallet");
    if (!localWallet) {
      alert("Please generate a wallet first");
      return;
    }
    wallet = JSON.parse(localWallet);
    if (!wallet) {
      alert("Please generate a wallet first");
      return;
    }
    console.log(wallet);
    const msgsigner = createDataItemSigner(wallet);
    console.log(msgsigner);
    await message({
      process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
      data: messageData,
      signer: msgsigner,
    });
  };

  onMount(async () => {
    await getMessages();
  });
</script>

<ChatWindow msgs={messages} />
