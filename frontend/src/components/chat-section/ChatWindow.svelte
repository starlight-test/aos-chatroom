<script>
    import {onDestroy, onMount} from 'svelte';
    import {ULID} from './util.js';
    import MsgLog from './MsgLog.svelte';

    let now = new Date().toISOString().substring(11, 16);
    let dayName = new Date().toISOString().substring(0, 10);
    let myUID = ULID().slice(8);

    export let msgs;

    // let msgs = [
    //     {message: 'THis is msg1', name: myUID, isDisplayable: true, strDate: now},
    //     {message: 'THis is msg2', name: myUID, isDisplayable: true, strDate: now},
    //     {message: 'THis is msg3', name: myUID, isDisplayable: true, strDate: now},
    //     {
    //         img: 'https://svelte.dev/_app/immutable/assets/svelte-machine-b729e4ba.avif',
    //         name: 'george@here.com',
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {daychange: true, strDate: dayName},
    //     {
    //         message: 'The average capabilities of language models tend to scale smoothly given more resources, specific capabilities can increase abruptly because of emergent capabilities. Therefore, a model that predicts linear improvements on certain capabilities in the short term could merely be a short tangent in a more complex non-linear model. This suggests that predicting specific capabilities in the long term is significantly more difficult.',
    //         name: myUID,
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {
    //         message: 'THis is msg6 THis is msg4THis is msg4THis is msg4THis is msg4THis is msg4',
    //         name: 'albert@here.com',
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {
    //         img: 'https://svelte.dev/whos-using-svelte/ibm.svg',
    //         name: myUID,
    //         isDisplayable: true,
    //         strDate: now},
    //     {
    //         message: 'There will be an increased effect of algorithmic advances on ML capabilities in the long term. More money and more cleverness from developers could overcome plateauing of improvements.',
    //         name: 'albert@here.com',
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {
    //         message: 'GPT-4 is doing very well on SAT, GMAT, LSAT and many other tests.',
    //         name: myUID,
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {
    //         message: 'There will be an increased effect of algorithmic advances on ML capabilities in the long term. More money and more cleverness from developers could overcome plateauing of improvements.',
    //         name: myUID,
    //         isDisplayable: true,
    //         strDate: now
    //     },
    //     {
    //         message: 'THis is msg10 THis is msg4THis is msg4THis is msg4THis is msg4THis is msg4',
    //         name: 'bertha@here.com',
    //         isDisplayable: true,
    //         strDate: now
    //     },
    // ];
    let myMsg = "";

    onMount(async () => {
    });

    onDestroy(() => {
    });

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

<MsgLog {msgs} {myUID}/>

<div class="flex justify-between gap-3 mr-5">
    <div class="bg-white w-full p-4 rounded-lg">
        <div class="relative bg-inherit">
            <input class="peer bg-transparent h-10 w-full rounded-lg text-gray-600 placeholder-transparent ring-2 px-2 ring-gray-500 focus:ring-sky-600 focus:outline-none focus:border-rose-600" id="username" name="username"
                   placeholder="Type your message..."
                   type="text"
                     bind:value={myMsg}
            />
            <label class="absolute cursor-text left-0 -top-3 text-sm text-gray-500 bg-inherit mx-1 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-2 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                   for="username">Type
                your message...</label>
        </div>
    </div>

    <div class="flex items-center justify-center">

    <div class="flex rounded-xl bg-gradient-to-tr from-pink-300 to-blue-300 p-0.5 shadow-lg">
        <button on:click={onInput} class="font-bold text-base bg-white px-8 py-2 rounded-xl">Send</button>
    </div>
    </div>
</div>
