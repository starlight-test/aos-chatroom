<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { ULID } from './util.js';
    import MsgLog from './MsgLog.svelte';
    import Arweave from 'arweave';
    import { createDataItemSigner, message } from "@permaweb/aoconnect";
    import type { JWKInterface } from "arweave/node/lib/wallet";
    const arweave = Arweave.init({
    });

    let imageToUpload: File | null = null;
    let files, fileInput;
    let wallet: JWKInterface | null = null;

    let now = new Date().toISOString().substring(11, 16);
    let dayName = new Date().toISOString().substring(0, 10);
    let myUID = ULID().slice(8);

    export let msgs;
    let myMsg = "";

    onMount(async () => {
        const localWallet = localStorage.getItem("wallet");
        if (!localWallet) {
            alert("Please generate a wallet first");
            return;
        }
        wallet = JSON.parse(localWallet);
    });

    onDestroy(() => {
    });

    const checkIfWalletCreated = () => {
        if (!wallet) {
            alert("Please generate a wallet first");
            return false;
        }
        return true;
    };

    const sendMessage = async () => {
        // if (!checkIfWalletCreated()) return;
        imageToUpload = fileInput.files[0];
        console.log(imageToUpload);
        uploadImageToArweave();
        const msgsigner = createDataItemSigner(wallet);
        console.log(msgsigner);
        await message({
            process: "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw",
            data: myMsg,
            signer: msgsigner,
        });
    };
    const generateWallet = async () => {
    wallet = await arweave.wallets.generate();
    console.log(wallet);
    localStorage.setItem("wallet", JSON.stringify(wallet));
    console.log(wallet);
  };
    const uploadImageToArweave = async () => {
        console.log(files)
        if (!imageToUpload)return;
        
        // Read the contents of the file asynchronously
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            if(!wallet){
                alert("Please generate a wallet first");
                return;
            }

            if (fileReader.result === null) {
                alert("Failed to read the file");
                return;
            }

            // When the file is loaded, create the transaction
            const buffer = Buffer.from(fileReader.result as ArrayBuffer);
            console.log(buffer);
            
            const transaction = await arweave.createTransaction({
                data: buffer // Convert the file content to a Buffer
            }, wallet);
            console.log(transaction)
            console.log(wallet)
            const res = await arweave.transactions.sign(transaction, wallet);

            // const response = await arweave.transactions.post(transaction);
            // console.log(response);

            let uploader = await arweave.transactions.getUploader(transaction);

            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
            }
        };

        // Start reading the file
        fileReader.readAsArrayBuffer(imageToUpload);


        // transaction.addTag('Content-Type', 'text/html');
        // transaction.addTag('key2', 'value2');
        // await arweave.transactions.sign(transaction, wallet);
        // let uploader = await arweave.transactions.getUploader(transaction);
        // while (!uploader.isComplete) {
        //     await uploader.uploadChunk();
        //     console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        // }

    };

    function onInput(e) {
        console.log(e);
        let o = {
            name: myUID,
            msg: myMsg,
            time: new Date().getTime(),
        }
        let m = {message: o.msg, name: myUID, isDisplayable: true, strDate: now};
        msgs = [...msgs, m];
        myMsg = "";
    }
</script>

<MsgLog {msgs} {myUID} />

<div class="flex justify-between gap-3 mr-5">
  <div class="bg-white w-full p-4 rounded-lg">
    <div class="relative bg-inherit">
      <input
        class="peer bg-transparent h-10 w-full rounded-lg text-gray-600 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600"
        id="username"
        name="username"
        placeholder="Type your message..."
        type="text"
        bind:value={myMsg}
      />
      <label
        class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
        for="username">Type your message...</label
      >
    </div>
  </div>

  <div class="flex items-center justify-center">
    <input
      type="file"
      accept="image/png, image/jpeg"
      bind:files
      bind:this={fileInput}
    />
    <button
      on:click={() => {
        files = [];
        fileInput.value = "";
      }}
    >
      reset
    </button>
    <button on:click={generateWallet}>asdassdasd</button>
    <div
      class="flex rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg"
    >
      <button
        on:click={sendMessage}
        class="font-bold text-base bg-white px-8 py-2 rounded-xl">Send</button
      >
    </div>
  </div>
</div>
