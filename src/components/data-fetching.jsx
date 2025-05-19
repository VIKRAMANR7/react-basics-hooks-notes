import { useEffect, useRef, useState } from "react";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export default function DataFetching() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [page, setPage] = useState(0);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/posts?page=${page}`, {
          signal: abortControllerRef.current.signal,
        });
        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Aborted");
          return;
        }
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (error) {
    return <div>Something went wrong. Please try again later.</div>;
  }
  return (
    <div>
      <h1 className="text-3xl mb-4">Data Fetching</h1>
      <button
        onClick={() => setPage(page + 1)}
        className="cursor-pointer bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition-colors ml-5"
      >
        Increase Page ({page})
      </button>
      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
