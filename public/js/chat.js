const socket = io();

socket.on("get-messages", (messages) => {
  const chat = document.getElementById("chat-list");
  chat.innerHTML = "";
  messages.forEach((message) => {
    const article = document.createElement("article");
    article.innerHTML = `<p><strong>User: </strong> ${message.user}</p>
        <p><strong>Message: </strong> ${message.message}</p>`;
    chat.appendChild(article);
  });
});

const chat = document.getElementById("formChat");

chat.addEventListener("submit", (e) => {
  e.preventDefault();

  const body = {
    user: socket.id,
    message: chat["txtMessage"].value,
  };
  socket.emit("send-message", body);
});
