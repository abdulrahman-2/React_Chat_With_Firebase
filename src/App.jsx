import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";

function App() {
  return (
    <>
      <div className="container">
        <h1>Hello</h1>
        <List />
        <Chat />
        <Detail />
      </div>
    </>
  );
}

export default App;
