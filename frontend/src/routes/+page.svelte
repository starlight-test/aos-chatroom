<script>
    import Arweave from 'arweave';
    import {results} from "@permaweb/aoconnect";

    const arweave = Arweave.init({});

    const generateWallet = async () => {
        const wallet = await arweave.wallets.generate();
        console.log(wallet);
    }
    async function getMessages() {
        let result = await results({
            process: "qeNpDBVhSdJQwHLK5LYq-rmzifl3UvPJrCoFuo1qx6E",
            sort: "ASC",
            limit: 25,
        });
        console.log(result);
    }

</script>

<button on:click={generateWallet}>Generate Wallet</button>
<button on:click={getMessages}>Get Messages</button>
