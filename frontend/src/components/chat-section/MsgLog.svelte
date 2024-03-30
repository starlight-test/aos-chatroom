<script>
    import {onMount, tick} from 'svelte';

    //import { user,roomIdx } from '../utils/stores.js';

    export let msgs = [];
    export let myUID = 'me@here.com';
    let msg = "";
    let user = {
        email: 'me@here.com',
    }

    let msgLogEl;

    onMount(() => {
        scrollToBottom();
    });

    $: {
        msgs.length;
        scrollToBottom();
    }

    export async function scrollToBottom() {
        if (!msgLogEl) return;
        await tick();         //  wait for any new message to appear in the log
        msgLogEl.scroll(0, msgLogEl.scrollHeight + 50);
    }

    function makeText(msg) {
        let txt = "";
        if (msg.joined) {
            txt = msg.joined + ' joined';
        } else if (msg.quit) {
            txt = (msg.quit + ' left the room');
        } else if (msg.ready) {
            txt = 'Ready';
        } else if (msg.clear) {
            txt = ('Everyone left the room');
        } else {
            txt = (msg.name + ' said ' + msg.message);
        }
        return txt;
    }
</script>

<div bind:this={msgLogEl} class="msgLogContent">
    {#if msgs?.length}
        {#each msgs as msg}
            {#if msg.daychange}
                <div class="msg">
                    <div class="dateChangeMsgRow">
                        <div>&nbsp;</div>
                        <div class="dateChangeDate">{msg.strDate}</div>
                        <div>&nbsp;</div>
                    </div>
                </div>
            {:else if msg.isDisplayable}
                <div class="msg">
                    {#if msg.name == myUID}
                        <div class="myMsgRow">
                            <div>&nbsp;</div>
                            <div class="myMsg">
                                {#if msg.img}
                                    <img src="{msg.img}" alt={"imagary by "+msg.name}/>
                                {:else if msg.message}
                                    {msg.message}
                                {:else if msg.binary}
                                    Download &nbsp;<a download="{msg.filename}" href="{msg.binary}">{msg.filename}</a>
                                {/if}
                                <div class="msgPost">
                                    <div class="{msg.isRead?'msgRead':''}">
                                        {msg.strDate}
                                    </div>
                                </div>
                            </div>
                        </div>
                    {:else}
                        <div class="theirMsgRow">
                            <div class="theirMsg">
                                {#if msg.img}
                                    <img src="{msg.img}" alt="imagery"/>
                                {:else if msg.message}
                                    <span class="name">{msg.name}:</span> {msg.message}
                                {:else if msg.binary}
                                    Download &nbsp;<a download="{msg.filename}" href="{msg.binary}">{msg.filename}</a>
                                {/if}
                                <div class="msgPost">
                                    <div class="{msg.isRead?'msgRead':''}">
                                        {msg.strDate}
                                    </div>
                                </div>
                            </div>
                            <div>&nbsp;</div>
                        </div>
                    {/if}
                </div>
            {/if}
        {/each}
    {:else}
        No messages yet.
    {/if}
</div>

<style>
    .name {
        font-weight: 600;
    }

    img {
        max-width: 400px;
        max-height: 400px;
    }

    .msgLogContent {
        overflow: auto;
        max-height: 650px;
        text-align: left;
    }

    .msg {
        border-radius: 8px;
        padding: 8px 28px;
    }

    .dateChangeMsgRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .dateChangeDate {
        background-color: rgb(184, 227, 255);
        padding: 8px;
        border: 1px solid rgb(187, 187, 187);
        border-radius: 8px;
        max-width: 20%;
    }

    .theirMsgRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
    }

    .myMsgRow {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-end;
    }

    .theirMsg {
        background-color: rgb(224, 224, 224);
        padding: 8px;
        border: 1px solid rgb(187, 187, 187);
        border-radius: 8px;
        max-width: 80%;
    }

    .myMsg {
        display: flex;
        align-items: flex-end;

        background-color: rgb(209, 252, 160);
        padding: 8px;
        border: 1px solid rgb(187, 187, 187);
        border-radius: 8px;
        border-top-right-radius: 0;
        max-width: 80%;
    }

    .msgPost {
        float: right;
        margin: 10px 0 -5px 4px;
        color: gray;
        font-size: 14px;
        font-weight: 400;
    }

    .msgRead {
        color: blue;
    }
</style>
