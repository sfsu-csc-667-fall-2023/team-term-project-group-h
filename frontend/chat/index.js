import { io } from "socket.io-client";

const chatSocket = io();

const chatMessages = document.querySelector("#chatMessages");

const roomId = document.querySelector("#roomId").value;

chatSocket.on(`chat:message:${roomId}`, ({ from, timestamp, message }) => {

    const div = document.querySelector("#chatMessage").content.cloneNode(true);

    const p = div.querySelector("p");
    const date = new Date(timestamp);

    p.innerText = `(${date.toTimeString().split(' ')[0]}) ${from}: ${message}`;

    chatMessages.appendChild(div);
})

document.querySelector("#chatInput").addEventListener("keydown", (event) => {
    if(event.keyCode === 13) {
        const message = event.target.value;

        fetch(`${document.location.pathname}/chat/`, {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message })
        })

        event.target.value = "";
    }
});

document.querySelector("#chatSubmit").addEventListener("click", (event) => {
        const message = document.querySelector("#chatInput").value;

        fetch(`${document.location.pathname}/chat/`, {
            method: "post",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ message })
        })

        document.querySelector("#chatInput").value = '';
});