function App() {
  return (
    <>
      <h1>Shortify AI - Convert articles into engaging short videos. </h1>
      <p>
        An AI-powered tool that reads an article, extracts key points, and
        converts it into a short video with auto-generated voiceovers,
        background music, and visuals.
      </p>
      <form>
        <input type="url" placeholder="https://..." />
        <button type="submit">Create Video</button>
      </form>
    </>
  );
}

export default App;
