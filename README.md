# 🎮 Generic Multiplayer Lobby Server (Node.js + TypeScript + Socket.io)

This project is a **lightweight and reusable lobby server** built with Node.js, TypeScript, and Socket.io. It acts as a signaling layer for multiplayer games where **one client acts as the host**, and others connect as players.

Designed to be **game-agnostic**, this server handles:
- Host and client connections
- Room creation and joining
- Basic message relaying
- Disconnection handling

---

## 📦 Features

- 💬 WebSocket-based communication via `socket.io`
- 🧠 Host = source of truth; server only routes messages
- 🎯 Room-based session support (e.g. multiple game instances)
- 🔁 Fully reusable across game types (board games, drawing games, etc.)
- 🔧 Written in **TypeScript** for type safety and maintainability

---

## 🚀 Getting Started

### 1. Clone or download this repo

```bash
git clone https://github.com/your-username/generic-lobby-server.git
cd generic-lobby-server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run in development mode

```bash
npm run dev
```

This uses `ts-node-dev` for hot-reloading.

### 4. Build and run production version

```bash
npm run build
npm start
```

---

## 📁 Folder Structure

```
/src
  └── server.ts       # Main server file
tsconfig.json         # TypeScript config
package.json          # Project metadata and scripts
```

---

## 🧠 How It Works

### Key Concepts

| Concept     | Description                                                              |
|-------------|--------------------------------------------------------------------------|
| **Host**    | A client that starts a room and maintains the authoritative game state   |
| **Client**  | A player that joins a room to participate in the game                    |
| **Room**    | A unique session ID representing a game instance                         |

---

### 🔌 Socket Events

#### ➕ `host-room`
```ts
socket.emit("host-room", { roomId: "abc123" });
```
Creates a new room with the current socket as the **host**.

---

#### ➕ `join-room`
```ts
socket.emit("join-room", { roomId: "abc123", metadata: { name: "Player1" } });
```
Joins a room. Sends optional metadata to the host.

---

#### 📩 `client-joined` (sent to host)
```ts
{
  clientId: "socket-id",
  metadata: { name: "Player1" }
}
```

---

#### 🔁 `relay`
```ts
socket.emit("relay", {
  to: "target-socket-id",
  type: "custom-message-type",
  payload: { ... }
});
```
Allows messages to be forwarded from host to client or vice versa.

---

#### ❌ `host-disconnected` (sent to all room clients)
Sent automatically when the host disconnects.

---

#### ❌ `client-disconnected` (sent to host)
Sent automatically when a player disconnects.

---

## 📦 Dependencies

- `express` – lightweight HTTP server
- `socket.io` – real-time WebSocket communication
- `typescript` – type-safe JavaScript
- `ts-node-dev` – dev server with reloads

---

## 🛠 Example Use Cases

- 🎲 Board games (e.g. Chess, Catan-style)
- ✏️ Drawing games (e.g. Pictionary)
- 🃏 Card games (e.g. Poker)
- ⚔️ Real-time multiplayer games (one player is the host/server)

---

## 💡 Notes

- This server does **not** manage game state — the **host client is responsible** for it.
- Server is purely a signaling and relay layer.
- Extend by adding authentication, analytics, or persistence as needed.

---

## 📜 License

MIT – use it in commercial or personal projects freely.
