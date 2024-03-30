<script lang="ts">
    import Arweave from 'arweave';
    import {results, createDataItemSigner, message} from "@permaweb/aoconnect";
    import type {JWKInterface} from "arweave/node/lib/wallet";
    const arweave = Arweave.init({});

    let wallet: JWKInterface | null = null;
    let messageData: string = "";
    let  messages;

    const generateWallet = async () => {
        wallet = await arweave.wallets.generate();
        localStorage.setItem("wallet", JSON.stringify(wallet));
        console.log(wallet);
    }
    async function getMessages() {
        const result = await results({
            process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
            sort: "ASC",
            limit: 50,
        });
        messages = result.edges
        console.log(messages);
    }

const sendMessage = async () => {
    const localWallet = localStorage.getItem("wallet");
    if(!localWallet) {
      alert("Please generate a wallet first");
      return;
    }
    wallet = JSON.parse(localWallet);
    if(!wallet) {
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
  }

</script>

<button on:click={generateWallet}>Generate Wallet</button>
<button on:click={getMessages}>Get Messages</button>
<input bind:value={messageData} placeholder="Enter message here" />
<button on:click={sendMessage}>Send Message</button>
