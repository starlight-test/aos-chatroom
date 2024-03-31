<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { ULID } from "./util.js";
    import MsgLog from "./MsgLog.svelte";
    import Arweave from "arweave";
    import { createDataItemSigner, message, result } from "@permaweb/aoconnect";
    import type { JWKInterface } from "arweave/node/lib/wallet";

    import { browser } from "$app/environment";

    import type { PermissionType } from "arconnect";
    import type { MouseEventHandler } from "svelte/elements";
    const arweave = Arweave.init({});

    let address: string | undefined;
    let dayName = new Date().toISOString().substring(0, 10);
    let fileInput: FileList;
    let files: FileList;
    let imageToUpload;
    let myUID = ULID().slice(8);

    export let msgs: any[];

    let myMsg = "";

    const permissions: PermissionType[] = [
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "ACCESS_ALL_ADDRESSES",
        "SIGN_TRANSACTION",
        "SIGNATURE",
        "DISPATCH",
        "ENCRYPT",
        "DECRYPT",
    ];

    const PROCESS_ID = "RUmNZFCeayzCxwzRT7Qiut9z1fQtfswsW0nTbEjcTWw";
    const sendMessage = async (messageData: string) => {
        if (!browser) {
            return;
        }
        if (!window.arweaveWallet) {
            alert("Please Install A arweave compatible wallet first!");
            return;
        }
        if (!address) {
            await window.arweaveWallet.connect(permissions);
            console.log("Wallet Connected", {
                activeaddr: await window.arweaveWallet.getActiveAddress(),
                alladdrs: await window.arweaveWallet.getAllAddresses(),
            });
            address = await window.arweaveWallet.getActiveAddress();
        }
        const messageId = await message({
            process: PROCESS_ID,
            data: messageData,
            signer: createDataItemSigner(window.arweaveWallet),
            tags: [
                {
                    name: "Action",
                    value: "Broadcast",
                },
                {
                    name: "sender",
                    value: address,
                },
                {
                    name: "Time",
                    value: Date.now().toString(),
                },
            ],
        });
        const msgres = await result({
            message: messageId,
            process: PROCESS_ID,
        });
        console.log(msgres);
    };
    const uploadImageToArweave = async () => {
        if (fileInput) {
            imageToUpload = fileInput.files[0];
            uploadImageToArweave();
        }
        // Read the contents of the file asynchronously
        const fileReader = new FileReader();
        fileReader.onload = async function () {
            if (!window.arweaveWallet) {
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

            const transaction = await arweave.createTransaction(
                {
                    data: buffer, // Convert the file content to a Buffer
                },
                "use_wallet",
            );
            transaction.addTag("Content-Type", "image/jpeg");
            console.log(transaction);
            console.log(window.arweaveWallet);
            const res = await arweave.transactions.sign(
                transaction,
                "use_wallet",
            );

            // const response = await arweave.transactions.post(transaction);
            // console.log(response);

            let uploader = await arweave.transactions.getUploader(transaction);

            while (!uploader.isComplete) {
                await uploader.uploadChunk();
                console.log(
                    `${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`,
                );
            }
        };

        // Start reading the file
        fileReader.readAsArrayBuffer(imageToUpload);

        // transaction.addTag('key2', 'value2');
        // await arweave.transactions.sign(transaction, wallet);
        // let uploader = await arweave.transactions.getUploader(transaction);
        // while (!uploader.isComplete) {
        //     await uploader.uploadChunk();
        //     console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        // }
    };
    function onInput(e: MouseEvent) {
        let o = {
            name: myUID,
            msg: myMsg,
            time: new Date().getTime(),
        };
        let m = {
            message: o.msg,
            name: myUID,
            isDisplayable: true,
            strDate: new Date().toISOString().substring(11, 16);,
        };
        msgs = [...msgs, m];
        sendMessage(m.message);
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
</div>

<div class="flex items-center justify-center">
    <input
        type="file"
        accept="image/png, image/jpeg"
        bind:files
        bind:this={fileInput}
    />
    <button on:click={uploadImageToArweave}> Upload Image to Chatroom </button>
    <div
        class="flex rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg"
    >
        <button
            on:click={onInput}
            class="font-bold text-base bg-white px-8 py-2 rounded-xl"
            >Send</button
        >
    </div>
</div>
